import { Entity } from './Entity';

export class Image extends Entity
{
	constructor(args,stage)
	{
		super(args,stage);
		this.args.src = '';

		this.args.type = 'image';
		this.template = require('./image.tmp');


		this.args.bindTo('src', (v,k)=>{
			console.log(k,v);
		});
	}

	export()
	{
		let _export = super.export();

		_export.properties = {
			src: this.args.src
		};

		return _export;
	}

	static import(skeleton, project)
	{
		let entity = super.import(skeleton, project);

		if(skeleton.properties)
		{
			entity.src = skeleton.properties.src;
		}

		return entity;
	}
}
