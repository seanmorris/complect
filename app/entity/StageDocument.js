import { Entity } from './Entity';

export class StageDocument extends Entity
{
	constructor(args,stage)
	{
		super(args,stage);

		this.args.type = 'document';
		this.template = '';
		this.document = (new DOMParser()).parseFromString(
			require('./stageDocument.tmp')
			, 'text/html'
		);

		this.args.editorStyles = '';

		this.args.styles = {};

		// this.args.styles.bindTo((v,k,t,d) => {
		// 	console.trace(k,d,v);
		// });
	}

	postRender()
	{
		// let head = this.findTag('head');

		// if(head)
		// {
		// 	this.styleView.render(head);
		// }
	}
}
