import { View } from 'curvature/base/View';
import { Form } from 'curvature/form/Form';
import { Toolbar } from './Toolbar';

export class Breakpoints extends View
{
	constructor(args)
	{
		super(args);

		this.template = require('./breakpoints.tmp');
		this.toolbar  = new Toolbar({main: this});

		this.args.breakpoints = {};

		this.args.showAdd = false;

		this.args.breakpointOptions = {};

		this.args.breakpoints.bindTo((v,k) => {
			this.args.breakpointOptions[k]=k;
		});

		this.args.breakpoints['all'] = {
			min:   null
			, max: null
		};

		this.args.form = null;
		this.args.newBreakpoint = null;

		this.prevBind = false;

		this.buildListForm();
		this.buildForm();
	}

	buildListForm()
	{
		let formSource = {"_method": "get"};
		let names      = Object.keys(this.args.breakpoints);
		let size       = names.length > 3 ? names.length : 3;

		formSource.breakpoint =  {
			name:  'breakpoint',
			title: '',
			type: 'select',
			value: 'all',
			options: this.args.breakpointOptions,
			attrs: {
				type: "select",
				name: 'breakpoint',
				size: size,
				id:   'current-breakpoint',

				"cv-on": 'change:change(event)',
			}
		};

		let form = new Form(formSource);

		form.fields.breakpoint.change = (event) => {
			this.args.project.currentBreakpoint = this.args.breakpoints[event.target.value];
		};

		this.args.listForm = form;
	}

	buildForm(entity)
	{
		let formSource = {"_method": "get"};
		let names      = Object.keys(this.args.breakpoints);
		let size       = names.length > 3 ? names.length : 3;

		formSource.min =  {
			name:  'min',
			title: 'Range:',
			type: 'text',
			value: '',
			attrs: {
				type: 'text',
				name: 'min',
				size: size,
				id:   'breakpoint-min',

				placeholder: 'min width in pixels',
			}
		};

		formSource.max =  {
			name:  'max',
			title: '',
			type: 'text',
			value: '',
			attrs: {
				type: 'text',
				name: 'max',
				size: size,
				id:   'breakpoint-max',

				placeholder: 'max width in pixels',
			}
		};

		formSource.buttons =  {
			"name":  'buttons',
			"title": '',
			"type":  'fieldset',
			"children": {},
			"attrs": {
				"type": 'fieldset',
				"name": 'buttons',
				"id":   'project-buttons'
			}
		};

		formSource.buttons.children.confirm =  {
			"name":  'confirm',
			"title": '🗹 confirm',
			"type":  'button',
			"attrs": {
				"type": 'button',
				"name": 'confirm',
				"id":   'breakpoint-confirm',
				"cv-on": 'click:click(event)',
			}
		};

		formSource.buttons.children.cancel =  {
			"name":  'cancel',
			"title": '✖ cancel',
			"type":  'button',
			"value": '',
			"attrs": {
				"type": 'button',
				"name": 'cancel',
				"id":   'breakpoint-cancel',
				"cv-on": 'click:click(event)',
			}
		};

		let form = new Form(formSource);

		form.fields.buttons.fields.confirm.click = (event) => {
			let min  = form.value.min;
			let max  = form.value.max;

			if(min === '' || max === '')
			{
				return;
			}

			[min,max] = [min,max].map(x=>x.match(/(\d+)/)[1]);

			if(min >= max || max === 0)
			{
				return;
			}

			let name = `${min}px - ${max}px`;

			if(!this.args.breakpoints[ name ])
			{
				this.args.breakpoints[ name ] = {
					min, max
				};
			}
			else if(this.args.listForm)
			{
				let listForm = this.args.listForm;

				listForm.fields.breakpoint.args.value = name;
			}

			this.args.showAdd = false;
		};

		form.fields.buttons.fields.cancel.click = (event) => {
			this.args.showAdd = false;
		};

		this.args.form = form;
	}
}
