import { View } from 'curvature/base/View';
import { Form } from 'curvature/form/Form';

import { Toolbar } from './Toolbar';

export class Templates extends View
{
	constructor(args)
	{
		super(args);
		this.template = require('./templates.tmp');
		this.toolbar  = new Toolbar({main: this});
		this.prevBind = null;

		this.buildForm();
	}

	add(name)
	{
		this.args.project.addTemplate(name);

		this.buildForm();
	}

	buildForm()
	{
		let formSource = {"_method": "get"};

		formSource.current = {
			"name":  'current',
			"title": 'current:',
			"type":  'text',
			"attrs":  {
				"type":        'select',
				"name":        'children',
				"id":          'templates-current',
				"placeholder": 'untitled',
			}
		};

		let templates = {};

		if(this.args.project)
		{
			let ids = Object.keys(this.args.project.templates);

			for(let i in ids)
			{
				let id = ids[i];

				let template = this.args.project.templates[id];

				templates[template.name] = template.name;
			}
		}


		formSource.children = {
			"name":    'children',
			"title":   'templates:',
			"type":    'select',
			"value":   null,
			"options": templates,
			"attrs": {
				"type":     'select',
				"name":     'children',
				"id":       'templates-templates',
				// "size":     this.args._children.length + (this.parent? 1:0), 
				"multiple": null,
				// "cv-on":    'click:childClicked(event)'
			}
		};

		this.args.form = new Form(formSource);

		if(this.prevBind)
		{
			this.prevBind();
		}

		this.prevBind = this.args.form.value.bindTo((v,k)=>{
			
		});
	}
}
