import { View   } from 'curvature/base/View';
import { Form   } from 'curvature/form/Form';

import { Label  } from '../entity/Label';
import { Image  } from '../entity/Image';
import { Entity } from '../entity/Entity';
import { Toolbar } from './Toolbar';

export class Builder extends View
{
	constructor(args)
	{
		super(args);

		this.parent   = false;
		this.template = require('./builder.tmp');
		this.toolbar  = new Toolbar({main: this});

		this.args.focus = null;
		this.prevBind   = null;

		this.args.bindTo('focus', (v,k,t) => {
			if(!v)
			{
				this.parent = null;
				return;
			}

			if(v instanceof Image || v instanceof Label)
			{
				this.toolbar.args.showAdd  = false;
				this.toolbar.args.disabled = 'disabled';
			}
			else if(v instanceof Entity)
			{
				this.toolbar.args.showAdd  = true;
				this.toolbar.args.disabled = '';
			}

			this.parent       = v.parent;
			this.args._parent = !!v.parent;

			this.reloadList(v);
			this.buildForm(v);
		});
	}

	add(addType = null)
	{
		if(!this.args.focus)
		{
			return;
		}

		let child;

		switch(addType)
		{
			case 'label':
				child = new Label({},this.stage);
				break;

			case 'image':
				child = new Image({},this.stage);
				break;

			default:
			case 'baseEntity':
				child = new Entity({},this.stage);
				break;
		}

		let entity = this.args.focus;

		entity.args.children.add(child);

		this.args.project.addComponent(child);

		this.reloadList(entity);
		this.buildForm(entity);
	}

	click(event, c)
	{
		console.log(c);

		let child = this.children[c];

		if(c === 'parent')
		{
			child = this.parent;
		}

		child.focus();
	}

	reloadList(entity)
	{
		this.children = entity.args.children.items()

		this.args._children = this.children.map((child)=>{
			return child.args.name;
		});

		// let field = this.args.form.fields.children;

		// field.options = this.args._children;
	}

	buildForm(entity)
	{
		let formSource = {"_method": "get"};
		let options    = {};

		if(this.parent)
		{
			options['.. parent'] = 'parent';
		}

		for(let i in this.args._children)
		{
			options[ this.args._children[i] ] = i;
		}

		let size = this.args._children.length;

		if(size < 3)
		{
			size = 3;
		}

		formSource.children = {
			"name":  'children',
			"title": '',
			"type":  'select',
			"value": null,
			"options": options,
			"attrs": {
				"type":     'select',
				"name":     'children',
				"id":       'builder-children',
				"size":     size, //+ (this.parent? 1:0), 
				"multiple": null,
				"cv-on":    'click:childClicked(event)'
			}
		};



		this.args.form = new Form(formSource);

		let select = this.args.form.fields.children;

		select.childClicked = (event)=>{
			this.childClicked(event);
		};

		// if(this.prevBind)
		// {
		// 	this.prevBind();
		// }

		// this.prevBind = this.args.form.value.bindTo((vv,kk)=>{
		// 	entity.args.states[kk] = vv;
		// });

		// this.args.states = Object.keys(entity.args.states);
	}

	childClicked(event)
	{
		let child = this.children[event.target.value];

		if(event.target.value === '')
		{
			return;
		}

		if(event.target.value === 'parent')
		{
			child = this.parent;
		}

		child.focus();
	}
}
