import { Bindable } from 'curvature/base/Bindable';

export class Template
{
	constructor(name )
	{
		this._id        = this.uuid();
		this.name       = name || '_' + this._id;
		this.templates  = {};
		this.components = {};
		this.styles     = {};

		let bindable = Bindable.makeBindable(this);

		this.bindTo('name', (v) => {
			console.log(v);
		});

		return bindable;
	}

	uuid() {
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(
			/[018]/g
			, c => (
				c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4
			).toString(16)
		);
	}
}
