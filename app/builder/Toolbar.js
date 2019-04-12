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

		this.args.addType = 'label';

		this.args.showAdd = false;
		this.args.disabled = '';
	}

	add(event, addType)
	{
		this.args.main.add(addType);
	}
}
