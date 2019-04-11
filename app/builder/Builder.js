import { View   } from 'curvature/base/View';
import { Entity } from '../stage/Entity';

export class Builder extends View
{
	constructor(args)
	{
		super(args);

		this.parent   = false;
		this.template = require('./builder.tmp');

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

	add()
	{
		if(!this.args.focus)
		{
			return;
		}

		let entity = this.args.focus;
		let child  = new Entity;

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
