import { Bindable } from 'curvature/base/Bindable';
import { Template } from './Template';

import Entity  from '../entity/Entity';
import EntityTypes  from '../entity/EntityTypes';

export class Project
{
	constructor()
	{
		let bindable = Bindable.makeBindable(this);

		this.name       = '';
		this.templates  = Bindable.makeBindable({});
		this.components = Bindable.makeBindable({});
		this.styles     = Bindable.makeBindable({});
		this.stage      = null;

		this.state = {
			components:    {}
			, templates:   {}
			, breakpoints: {}
		};

		this.currentBreakpoint = null;

		this._currentTemplate = null;

		this.bindTo('name', (v) => {
			// console.log(v);
		});

		return bindable;
	}

	addTemplate()
	{
		let template = new Template({project:this}, this.stage);

		template.project = this;

		this.templates[ template.uuid ] = template;

		return template;
	}

	addComponent(entity)
	{
		if(this.components[ entity.args.uuid ])
		{
			throw new Error(`Component with id "${entity.args.name}" exists!`);
		}

		entity.project = this;

		// this.stage.args.styles[ entity.args.uuid ] = entity.styleView;

		let skeleton = entity.export();

		this.state.components[ entity.args.uuid ] = {
			uuid: entity.args.uuid
			, name: entity.args.name
			, type: entity.args.type
		};

		this.components[ entity.args.uuid ] = entity;

		this.linkComponent(entity);
	}

	linkComponent(component)
	{
		let uuid = component.args.uuid;

		let scalarDebind = component.args.bindTo((v,k,t,d)=>{
			if(d)
			{
				delete this.state.components[uuid][k];
				return;
			}

			if(!v || typeof v === 'object')
			{
				return;
			}

			if(-1 !== ['name', 'uuid', 'type'].indexOf(k))
			{
				this.state.components[uuid][k] = v;
			}

			if(-1 !== ['src', 'content'].indexOf(k))
			{
				if(!this.state.components[uuid].properties)
				{
					this.state.components[uuid].properties = {};
				}

				this.state.components[uuid].properties[k] = v;
			}
		});

		let childDebind = component.args._children.bindTo((v,k,t,d) => {
			if(k === 'length')
			{
				return;
			}

			if(d)
			{
				delete this.state.components[uuid][k];
				return;
			}

			if(!this.state.components[uuid].children)
			{
				this.state.components[uuid].children = [];
			}

			this.state.components[uuid].children[k] = v.args.uuid;
		});

		let styleDebind = component.args.styles.bindTo((v,k,t,d) => {
			if(d)
			{
				delete this.state.styles[uuid][k];
				return;
			}

			if(!this.state.components[uuid].styles)
			{
				this.state.components[uuid].styles = {};
			}

			let subStyleDebind = v.bindTo((vv,kk,tt,dd) => {

				if(!this.state.components[uuid].styles[k])
				{
					this.state.components[uuid].styles[k] = {};
				}

				this.state.components[uuid].styles[k][kk] = vv;

			});

			component.cleanup.push(subStyleDebind);
		});

		component.cleanup.push(() => {
			scalarDebind();
			childDebind();
			styleDebind();
		})
	}

	getComponent(id)
	{
		if(!this.components[ id ])
		{
			throw new Error(`Component "${id}" does not exist!`);
		}

		let component = this.components[ id ];

		let skeleton    = this.state.components[ id ];
		let entityClass = Entity;

		if(EntityTypes[skeleton.type])
		{
			entityClass = EntityTypes[skeleton.type];
		}

		let entity = entityClass.import(skeleton, this);

		this.linkComponent(entity);

		return entity;
	}

	getTemplate(id)
	{
		if(this.templates[ id ])
		{
			return this.templates[ id ];
		}

		throw new Error(`Template "${id}" does not exist!`);
	}

	currentTemplate(id)
	{
		if(id)
		{
			let skeleton = this.getTemplate(id).export();
			let template = Template.import(skeleton, this);

			if(this._currentTemplate)
			{
				this._currentTemplate.remove();
			}

			this._currentTemplate = template;
		}

		return this._currentTemplate;
	}

	export()
	{
		let name       = this.name;
		let components = {};
		let templates  = {};

		for(let i in this.templates)
		{
			templates[i] = this.templates[i].export();
		}

		return {name,templates,components: this.state.components};
	}

	static import(skeleton)
	{
		let project = new this;
	}
}
