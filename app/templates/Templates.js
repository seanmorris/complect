import { View } from 'curvature/base/View';
import { Form } from 'curvature/form/Form';

import { Toolbar } from './Toolbar';

export class Templates extends View
{
	constructor(args)
	{
		super(args);
		this.template = require('./templates.tmp');
		this.toolbar  = new Toolbar({main: this});
		this.prevBind = null;

		this.currentTemplate = null;

		this.buildForm({});

		this.projectDebind = () => {};

		this.args.bindTo('project', (v) => {
			if(!v)
			{
				return;
			}

			let templateDebind = v.bindTo('_currentTemplate', (vv,kk,tt) => {
				this.currentTemplate = vv;

				if(!vv || !this.args.form)
				{
					return;
				}

				this.args.form.fields.current.args.value = vv.name;
			});

			let templatesDebind = v.templates.bindTo((vv,kk,tt) => {
				if(!vv)
				{
					return;
				}
				
				this.buildForm(this.templates(v));
			},{wait:0});

			this.projectDebind();

			this.projectDebind = () => {
				templateDebind();
				templatesDebind();
			};
		});
	}

	add(name)
	{
		this.args.project.addTemplate(name);
	}

	buildForm(templates)
	{
		let formSource = {"_method": "get"};

		formSource.current = {
			"name":  'current',
			"title": 'current:',
			"type":  'text',
			"value": this.currentTemplate ? this.currentTemplate.name : null,
			"attrs":  {
				"type":        'text',
				"name":        'children',
				"id":          'templates-current',
				"placeholder": 'untitled',
			}
		};

		let size = Object.keys(templates).length;

		if(size < 3)
		{
			size = 3;
		}

		formSource.children = {
			"name":    'children',
			"title":   'templates:',
			"type":    'select',
			"value":   null,
			"options": templates,
			"attrs": {
				"type":     'select',
				"name":     'children',
				"id":       'templates-templates',
				"size":     size,
				"cv-on":    'click:templateClicked(event)'
			}
		};

		this.args.form = new Form(formSource);

		this.args.form.fields.children.templateClicked = (event) => {
			if(!event.target.value === '')
			{
				return;
			}

			this.args.project.currentTemplate(event.target.value);
		};

		if(this.prevBind)
		{
			this.prevBind();
		}

		this.prevBind = this.args.form.value.bindTo((v,k)=>{
			
		});
	}

	templates(project)
	{
		let templates = {};

		if(project)
		{
			let ids = Object.keys(project.templates);

			for(let i in ids)
			{
				let id = ids[i];

				let template = project.templates[id];

				templates[template.name] = template.uuid;
			}
		}

		return templates;
	}
}
