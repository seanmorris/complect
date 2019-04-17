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

		this.template     = require('./triptych.tmp');

		let project       = new Project;
		let left          = new ProjectColumn;
		let right         = new ObjectColumn;

		this.args.left    = left;
		this.args.right   = right;
		this.args.project = project;
	}

	postRender()
	{
		let left    = this.args.left;
		let right   = this.args.right;

		this.args.bindTo('project', (v, k) => {
			let project = v;

			left.args.project  = project;
			right.args.project = project;

			this.stage = new Stage({
				rootEntity: null
				, triptych: this
				, project
			});

			this.stage.root = this.root;

			project.bindTo('_currentTemplate', (v,k,t) => {
				if(!v)
				{
					return;
				}

				this.stage = new Stage({
					rootEntity: null
					, triptych: this
					, project
				});

				this.stage.root = this.root;

				project.stage = this.stage;

				this.focus(v.rootEntity);

				v.rootEntity.stage = this.stage;

				this.stage.args.rootEntity = v.rootEntity;

				this.args.center = this.stage;

				for(let i in left.args.entries)
				{
					if(!left.args.entries[i].args.content)
					{
						continue;
					}

					let entry = left.args.entries[i].args.content;

					entry.triptych = this;
					entry.stage    = this.stage;
				}

				for(let i in right.args.entries)
				{
					if(!right.args.entries[i].args.content)
					{
						continue;
					}

					let entry = right.args.entries[i].args.content;

					entry.triptych = this;
					entry.stage    = this.stage;
				}
			});
			
			for(let i in left.args.entries)
			{
				if(!left.args.entries[i].args.content)
				{
					continue;
				}

				let entry = left.args.entries[i].args.content;

				entry.args.project = project;
				entry.triptych     = this;
				entry.stage        = this.stage;
				
			}

			for(let i in right.args.entries)
			{
				if(!right.args.entries[i].args.content)
				{
					continue;
				}

				let entry = right.args.entries[i].args.content;

				entry.args.project = project;
				entry.triptych     = this;
				entry.stage        = this.stage;
			}

			project.stage = this.stage;

			console.log(Object.keys(project.templates));

			// let template = project.addTemplate();

			// project.currentTemplate(template.uuid);
		});
	}

	focus(entity)
	{
		let right = this.args.right;

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
