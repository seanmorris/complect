import { View   } from 'curvature/base/View';
import { Column } from './Column';

import { Project } from '../project/Project';

import { ObjectColumn  } from './ObjectColumn';
import { ProjectColumn } from './ProjectColumn';

import { SampleView } from '../pak/SampleView';

import { Entity }     from '../entity/Entity';
import { Stage }      from '../stage/Stage';

export class Triptych extends View
{
	constructor(args)
	{
		super(args);

		this.template    = require('./triptych.tmp');

		let project      = new Project;
		let entity       = new Entity;
		let stage        = new Stage({
			rootEntity: entity
			, triptych: this
			, project
		});

		let left         = new ProjectColumn({project});
		let right        = new ObjectColumn({project});

		this.stage       = stage;

		left.args.title  = 'complect 0.01';
		right.args.title = 'Object';

		this.args.entity  = entity;
		this.args.left    = left;
		this.args.center  = stage;
		this.args.right   = right;
		this.args.project = project;
	}

	postRender()
	{
		let entity = this.args.entity;
		let left   = this.args.left;
		let right  = this.args.right;

		this.focus(entity);

		for(let i in left.args.entries)
		{
			if(!left.args.entries[i].args.content)
			{
				continue;
			}

			let entry = left.args.entries[i].args.content;

			entry.args.project = this.args.project;
		}
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
