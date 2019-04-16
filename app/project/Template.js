import { Bindable } from 'curvature/base/Bindable';
import { Entity } from '../entity/Entity';
import { StageDocument } from '../entity/StageDocument';

import uuid from 'uuid';

export class Template
{
	constructor(args = {}, stage = null)
	{
		let template = Bindable.makeBindable(this);

		if(args.uuid)
		{
			let skeleton = args.project.getTemplate(args.uuid).export();

			// console.log(skeleton);
			
			template.rootEntity = args.project.getComponent(skeleton.root, true);
		}
		else
		{
			template.uuid       = uuid();
			template.name       = '_' + this.uuid;
			template.project    = null;
			template.templates  = {};
			template.components = {};
			template.styles     = {};

			template.rootEntity = new StageDocument({}, this.stage);

			args.project.addComponent(template.rootEntity);
		}

		template.stage = stage;

		template.bindTo('name', (v) => {
			// console.log(v);
		});

		template.bindTo('project', (v) => {
			if(!v)
			{
				return;
			}
		});

		template.rootEntity.args.editorStyles = `
			[data-metastate~="hover"] {
				outline: 4px solid rgba(0,0,0,0.3);
			}


			[data-metastate~="click"] {
				outline: 4px solid rgba(0,0,0,1);
				outline-offset: -2px
			}
		`;
		// template.rootEntity = new Body({}, template.stage);
		// template.rootEntity = new Entity({}, template.stage);

		return template;
	}

	remove()
	{
		this.rootEntity.remove();
	}

	export()
	{
		// console.log(this.rootEntity);
		return {
			uuid:   this.uuid
			, name: this.name
			, root: this.rootEntity.args.uuid
		};
	}

	static import(skeleton, project)
	{
		return new this({
			uuid: skeleton.uuid
			, project: project
		});
	}
}
