import { Bindable } from 'curvature/base/Bindable';
import { Template } from './Template';

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

		this._currentTemplate = null;

		this.bindTo('name', (v) => {
			console.log(v);
		});

		return bindable;
	}

	addTemplate()
	{
		let template = new Template(null, this.stage);

		template.project = this;

		this.templates[ template.name ] = template;

		return template;
	}

	addComponent(entity)
	{
		if(this.components[ entity.args.name ])
		{
			throw new Error(`Component with id "${entity.args.name}" exists!`);
		}

		entity.project = this;

		this.components[ entity.args.name ] = entity;
	}

	currentTemplate(id)
	{
		if(id)
		{
			if(this._currentTemplate)
			{
				// this._currentTemplate.rootEntity.remove();
			}

			this._currentTemplate = this.templates[ id ];
		}

		return this._currentTemplate;
	}

	export()
	{
		let name       = this.name;
		let components = {};
		let templates  = {};

		for(let i in this.components)
		{
			components[i] = this.components[i].export();
		}

		for(let i in this.templates)
		{
			templates[i] = this.templates[i].export();
		}

		return {name,templates,components};
	}

	import()
	{

	}
}
