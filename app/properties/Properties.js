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

			if(!v.args.name)
			{
				v.args.name = '_' + v.args._id;
			}

			this.args.className = v.args.name;
		}, {wait: 0});

		this.args.bindTo('className', (v,k,t) => {
			if(!this.args.focus)
			{
				return;
			}

			this.args.focus.args.name = v;
		});
	}
}
