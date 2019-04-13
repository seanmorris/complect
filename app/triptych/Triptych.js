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

		let stage        = new Stage({
			rootEntity: null
			, triptych: this
			, project
		});

		let left          = new ProjectColumn;
		let right         = new ObjectColumn;

		this.stage        = stage;

		left.args.title   = 'complect 0.01';
		right.args.title  = 'Object';

		this.args.left    = left;
		this.args.center  = stage;
		this.args.right   = right;
		this.args.project = project;
	}

	postRender()
	{
		let left    = this.args.left;
		let right   = this.args.right;
		let project = this.args.project;
		let stage   = this.stage;

		left.args.project  = project;
		right.args.project = project;

		project.bindTo('_currentTemplate', (v,k,t) => {
			if(!v)
			{
				return;
			}

			// console.log(JSON.stringify(
			// 	stage.args.rootEntity.export()
			// 	, null
			// 	, 4
			// ));

			this.focus(v.rootEntity);

			v.rootEntity.stage = stage;

			stage.args.rootEntity = v.rootEntity;
		});

		for(let i in left.args.entries)
		{
			if(!left.args.entries[i].args.content)
			{
				continue;
			}

			let entry = left.args.entries[i].args.content;

			entry.args.project = project;
		}

		for(let i in right.args.entries)
		{
			if(!right.args.entries[i].args.content)
			{
				continue;
			}

			let entry = right.args.entries[i].args.content;

			entry.args.project = project;
		}

		let template = project.addTemplate();

		project.currentTemplate(template.name);
	}

	focus(entity)
	{
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
