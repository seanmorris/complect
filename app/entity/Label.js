import { Entity } from './Entity';

export class Label extends Entity
{
	constructor(args,stage)
	{
		super(args,stage);
		this.args.content = 'style me.'

		this.args.type = 'label';
		this.template = require('./label.tmp');


		// this.args.bindTo('content', (v,k)=>{
		// 	console.log(k,v);
		// });
	}

	export()
	{
		let _export = super.export();

		_export.properties = {
			content: this.args.content
		};

		return _export;
	}

	static import(skeleton, project)
	{
		let entity = super.import(skeleton, project);

		if(skeleton.properties)
		{
			entity.content = skeleton.properties.content;
		}

		return entity;
	}
}
