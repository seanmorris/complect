import { Bindable } from 'curvature/base/Bindable';
import { Template } from './Template';

export class Project
{
	constructor()
	{
		this.name       = '';
		this.templates  = {};
		this.components = {};
		this.styles     = {};

		let bindable = Bindable.makeBindable(this);

		this.bindTo('name', (v) => {
			console.log(v);
		});

		return bindable;
	}

	addTemplate()
	{
		let template = new Template;

		this.templates[ template.name ] = template;

		return template;
	}
}
