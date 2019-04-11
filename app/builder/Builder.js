import { View   } from 'curvature/base/View';
import { Entity } from '../stage/Entity';

export class Builder extends View
{
	constructor(args)
	{
		super(args);

		this.template   = require('./builder.tmp');
		this.args.focus = null;

		this.args.bindTo('focus', (v,k,t) => {
			if(!v)
			{
				return;
			}
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
		child.stage = entity.stage;

		this.args.children = entity.args.children.items().map((child)=>{
			return child.type;
		});
	}
}
