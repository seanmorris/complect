import { View } from 'curvature/base/View';

export class Styles extends View
{
	constructor(args)
	{
		super(args);
		this.template        = require('./styles.tmp');
		this.args.content    = this.args.content    || '';
		this.args.breakpoint = this.args.breakpoint || '';

		this.args._content   = this.args.content;

		this.args.bindTo('breakpoint', (v) => {

		});
	}

	rebuild()
	{
		if(this.args.breakpoint)
		{
			return ``;
		}
	}
}
