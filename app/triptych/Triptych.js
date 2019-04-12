import { View   } from 'curvature/base/View';
import { Column } from './Column';

import { SampleView } from '../pak/SampleView';

import { Entity }     from '../entity/Entity';
import { Stage }      from '../stage/Stage';

export class Triptych extends View
{
	constructor(args)
	{
		super(args);

		this.template    = require('./triptych.tmp');

		let entity       = new Entity;
		let stage        = new Stage({rootEntity: entity, triptych: this});
		let left         = new Column;
		let right        = new Column;

		this.stage       = stage;

		left.args.title  = 'Project';
		right.args.title = 'Object';

		this.args.entity = entity;
		// this.args.left   = left;
		this.args.center = stage;
		this.args.right  = right;
	}

	postRender()
	{
		let entity = this.args.entity;
		let right  = this.args.right;

		this.focus(entity);
	}

	focus(entity)
	{
		let thing  = this.args.entity;
		let right  = this.args.right;

		for(let i in right.args.entries)
		{
			if(!right.args.entries[i].args.content)
			{
				continue;
			}

			let entry = right.args.entries[i].args.content;

			entry.args.focus = entity;
		}
	}
}
