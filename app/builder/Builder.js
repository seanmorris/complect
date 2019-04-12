import { View   } from 'curvature/base/View';
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

		this.args.focus  = null;

		this.args.bindTo('focus', (v,k,t) => {
			if(!v)
			{
				return;
			}

			this.reloadList(v);

			this.parent       = v.parent;
			this.args._parent = !!v.parent;
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
				child = new Label;
				break;

			case 'image':
				child = new Image;
				break;

			default:
			case 'baseEntity':
				child = new Entity;
				break;
		}

		let entity = this.args.focus;

		entity.args.children.add(child);

		this.reloadList(entity);
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
			return child.args.name ||child.args._id;
		});
	}
}
