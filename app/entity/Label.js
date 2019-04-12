import { Entity } from './Entity';

export class Label extends Entity
{
	constructor(args)
	{
		super(args);
		this.args.content = 'style me.'

		this.type     = 'label';
		this.template = require('./label.tmp');


		// this.args.bindTo('content', (v,k)=>{
		// 	console.log(k,v);
		// });
	}
}
