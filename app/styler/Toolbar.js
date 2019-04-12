import { View } from 'curvature/base/View';

export class Toolbar extends View
{
	constructor(args)
	{
		super(args);
		this.template = require('./toolbar.tmp');

		this.args.types = {
			'Base Entity': 'baseEntity'
			, 'Label':     'label'
			, 'Image':     'image'
			, 'Form':      'form'
		};

		this.args.filter = 'basic';

		this.args.bindTo('filter', (v, k) => {
			this.args.main.args.filter = v;
		});
		this.args.bindTo('search', (v, k) => {
			this.args.main.args.search = v;
		});
	}

	add(event, addType)
	{
		// this.args.main.add(addType);
	}
}
