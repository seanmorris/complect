import { Entity } from './Entity';

export class StageDocument extends Entity
{
	constructor(args,stage)
	{
		super(args,stage);

		this.document = (new DOMParser()).parseFromString(
			require('./stageDocument.tmp')
			, 'text/html'
		);
	}

	postRender()
	{
		let head = this.findTag('head');

		console.log(head);

		if(head)
		{
			this.styleView.render(head);
		}
	}
}
