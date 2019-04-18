import { Bindable } from 'curvature/base/Bindable';
import { Entity } from '../entity/Entity';
import { StageDocument } from '../entity/StageDocument';

import uuid from 'uuid';

export class Template
{
	constructor(args = {}, stage = null)
	{
		let entity;
		let template = Bindable.makeBindable(this);

		if(args.root)
		{
			entity = args.project.getComponent(args.root);
		}
		else
		{
			entity = new StageDocument({}, template.stage);
			args.project.addComponent(entity);
		}

		template.rootEntity = entity;

		template.uuid       = args.uuid    || uuid();
		template.name       = args.name    || '_' + template.uuid;
		template.root       = entity.args.uuid;
		template.project    = args.project || null;
		template.templates  = {};
		template.components = {};

		template.stage = stage;

		template.rootEntity.args.editorStyles = `
			[data-metastate~="hover"] {
				outline: 4px solid rgba(0,0,0,0.3);
			}


			[data-metastate~="click"] {
				outline:        4px solid rgba(0,0,0,1);
				outline-offset: -2px
			}

			body {
				cursor:      crosshair;
				user-select: none;
			}

		`;

		return template;
	}

	remove()
	{
		this.rootEntity.remove();
	}

	export()
	{
		return {
			uuid:   this.uuid
			, name: this.name
			, root: this.rootEntity.args.uuid
		};
	}

	static import(skeleton, project)
	{
		return new this({
			uuid:      skeleton.uuid
			, name:    skeleton.name
			, root:    skeleton.root
			, project: project
		}, project.stage);
	}
}
