import { Entity } from './Entity';

export class Image extends Entity
{
	constructor(args)
	{
		super(args);
		this.args.src = '';

		this.type     = 'label';
		this.template = require('./image.tmp');


		this.args.bindTo('src', (v,k)=>{
			console.log(k,v);
		});
	}
}
