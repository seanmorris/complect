import { View } from 'curvature/base/View';

export class Properties extends View
{
	constructor(args)
	{
		super(args);
		this.template = require('./properties.tmp');

		this.args.className = '';

		this.args.bindTo('focus', (v,k,t) => {
			if(!v)
			{
				return;
			}
		});

		this.args.bindTo('className', (v,k,t) => {
			if(!this.args.focus)
			{
				return;
			}

			this.args.focus.args.name = v;
		});
	}
}
