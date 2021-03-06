import { Bindable } from 'curvature/base/Bindable';
import { Template } from './Template';

import Entity  from '../entity/Entity';
import EntityTypes  from '../entity/EntityTypes';

// import Template  from './Template';

export class Project
{
	constructor(skeleton = {}, stage)
	{
		let bindable = Bindable.makeBindable(this);

		this.name       = skeleton.name || '';
		this.templates  = Bindable.makeBindable({});
		this.components = Bindable.makeBindable({});
		this.styles     = Bindable.makeBindable({});
		this.stage      = stage || null;

		this.state = Bindable.makeBindable({
			components:    {}
			, templates:   {}
			, breakpoints: {}
		});

		this.currentBreakpoint = null;

		this._currentTemplate = null;

		// this.bindTo('name', (v) => {
		// 	console.log(v);
		// });

		// this.state.components.bindTo((v,k) => {
		// 	console.log(k,v);
		// });

		if(skeleton.components)
		{
			Object.assign(this.state.components, skeleton.components);

			for(let i in skeleton.components)
			{
				let subSkeleton = skeleton.components[i];
				let newSkeleton = {};

				Object.assign(newSkeleton, subSkeleton);
				Object.assign(newSkeleton, {project: this});

				let entity = this.getComponent(i);
			}
		}

		if(skeleton.templates)
		{
			this.state.templates = skeleton.components;

			for(let i in skeleton.templates)
			{
				let subSkeleton = skeleton.templates[i];

				subSkeleton.project = this;

				this.addTemplate(subSkeleton);
			}
		}

		return bindable;
	}

	addComponent(entity)
	{
		if(this.components[ entity.args.uuid ])
		{
			throw new Error(`Component with id "${entity.args.name}" exists!`);
		}

		entity.project = this;

		this.state.components[ entity.args.uuid ] = {
			uuid: entity.args.uuid
			, name: entity.args.name
			, type: entity.args.type
		};

		this.components[ entity.args.uuid ] = entity;

		this.linkComponent(entity);
	}

	getComponent(id)
	{
		if(!this.state.components[ id ])
		{
			throw new Error(`Component "${id}" does not exist!`);
		}

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

	addTemplate(skeleton = {})
	{
		let newSkeleton = {};

		Object.assign(newSkeleton, skeleton);
		Object.assign(newSkeleton, {project: this});

		let template = new Template(newSkeleton, this.stage);

		template.project = this;

		this.linkTemplate(template);

		this.templates[ template.uuid ] = template;

		return template;
	}

	getTemplate(id)
	{
		if(!this.state.templates[ id ])
		{
			throw new Error(`Template "${id}" does not exist!`);
		}

		let skeleton = this.state.templates[ id ];
		let template = Template.import(skeleton, this);

		this.linkTemplate(template);

		return template;
	}

	linkComponent(component)
	{
		let uuid = component.args.uuid;

		let scalarDebind = component.args.bindTo((v,k,t,d) => {
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
				delete this.state.components[uuid].children[k];
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
				this.state.components[uuid].styles[k];
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

		let stateDebind = component.args.states.bindTo((v,k,t,d) => {
			if(d)
			{
				this.state.components[uuid].states[k];
				return;
			}

			if(!this.state.components[uuid].states)
			{
				this.state.components[uuid].states = {};
			}

			this.state.components[uuid].states[k] = !!v;

			component.cleanup.push(stateDebind);
		});

		component.cleanup.push(() => {
			scalarDebind();
			childDebind();
			styleDebind();
			stateDebind();
		})
	}

	linkTemplate(template)
	{
		let uuid = template.uuid;

		let scalarDebind = template.bindTo((v,k,t,d) => {
			if(d)
			{
				delete this.state.templates[uuid][k];
				return;
			}

			if(!v || typeof v === 'object')
			{
				return;
			}

			if(-1 !== ['name', 'uuid', 'root'].indexOf(k))
			{
				if(!this.state.templates[uuid])
				{
					this.state.templates[uuid] = {};
				}

				this.state.templates[uuid][k] = v;
			}
		});

		template.rootEntity.cleanup.push(() => {
			scalarDebind();
		})
	}

	currentTemplate(id)
	{
		if(id)
		{
			let template = this.getTemplate(id);

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

		let exported = {
			name
			, templates
			, components: this.state.components
		};

		return exported;
	}

	static import(skeleton, stage)
	{
		let project = new this(skeleton, stage);

		return project;
	}
}
