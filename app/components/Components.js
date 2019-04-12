import { View } from 'curvature/base/View';
import { Form } from 'curvature/form/Form';

import { Toolbar } from './Toolbar';

export class Components extends View
{
	constructor(args)
	{
		super(args);
		this.template = require('./components.tmp');
		this.toolbar  = new Toolbar({main: this});
		this.prevBind = null;

		this.buildForm();
	}

	buildForm()
	{
		let formSource = {"_method": "get"};

		formSource.children = {
			"name":  'children',
			"title": '',
			"type":  'select',
			"value": null,
			"options": [],
			"attrs": {
				"type":     'select',
				"name":     'children',
				"id":       'builder-children',
				// "size":     this.args._children.length + (this.parent? 1:0), 
				"multiple": null,
				// "cv-on":    'click:childClicked(event)'
			}
		};

		this.args.form = new Form(formSource);

		if(this.prevBind)
		{
			this.prevBind();
		}

		this.prevBind = this.args.form.value.bindTo((v,k)=>{
			
		});
	}
}
