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
	}

	postRender()
	{
		let head = this.findTag('head');

		if(head)
		{
			this.styleView.render(head);
		}
	}
}
