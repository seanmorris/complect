import { Entity } from './Entity';

export class Image extends Entity
{
	constructor(args)
	{
		super(args);
		this.args.src = '';

		this.type     = 'image';
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
}
