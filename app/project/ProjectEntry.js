import { View } from 'curvature/base/View';
import { Form } from 'curvature/form/Form';

import { Toolbar } from './Toolbar';

export class ProjectEntry extends View
{
	constructor(args)
	{
		super(args);
		this.template = require('./projectEntry.tmp');
		this.toolbar  = new Toolbar({main: this});
		this.prevBind = null;

		this.buildForm();
	}

	buildForm()
	{
		let formSource = {"_method": "get"};

		formSource.name =  {
			"name":  'project-name',
			"title": 'name',
			"type":  'text',
			"value": '',
			"attrs": {
				"type": 'text',
				"name": 'project-name',
				"id":   'project-name',
				"placeholder": 'untitled'
			}
		};

		formSource.buttons =  {
			"name":  'buttons',
			"title": '',
			"type":  'fieldset',
			"value": '',
			"children": {},
			"attrs": {
				"type": 'fieldset',
				"name": 'buttons',
				"id":   'project-buttons'
			}
		};

		formSource.buttons.children.save =  {
			"name":  'save',
			"title": 'save',
			"type":  'button',
			"value": '',
			"attrs": {
				"type": 'button',
				"name": 'save',
				"id":   'save',

				"cv-on": 'click:click(event)',
			}
		};

		formSource.buttons.children.load =  {
			"name":  'load',
			"title": 'load',
			"type":  'button',
			"value": '',
			"attrs": {
				"type": 'button',
				"name": 'load',
				"id":   'load'
			}
		};

		this.args.form = new Form(formSource);

		this.args.form.fields.buttons.fields.save.click = ()=>{
			console.log(JSON.stringify(
				this.args.project.export()
			, null,4));
			
		};

		if(this.prevBind)
		{
			this.prevBind();
		}

		this.prevBind = this.args.form.value.bindTo((v,k)=>{
			if(!this.args.project)
			{
				return;
			}

			if(k === 'name')
			{
				this.args.project.name = v;
			}
		});
	}
}
