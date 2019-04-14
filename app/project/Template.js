import { Bindable } from 'curvature/base/Bindable';

import { Entity } from '../entity/Entity';

export class Template
{
	constructor(name = null, stage = null)
	{
		this._id        = this.uuid();
		this.name       = name || '_' + this._id;
		this.project    = null;
		this.templates  = {};
		this.components = {};
		this.styles     = {};
		this.stage      = stage;

		let bindable = Bindable.makeBindable(this);

		this.bindTo('name', (v) => {
			// console.log(v);
		});

		this.bindTo('project', (v) => {
			if(!v)
			{
				return;
			}
			v.addComponent(this.rootEntity);
		});

		this.rootEntity = new Entity({}, this.stage);

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

	export()
	{
		return {
			id:     this._id
			, name: this.name
			, root: this.rootEntity.args._id
		};
	}
}
