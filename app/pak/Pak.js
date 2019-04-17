import { View } from 'curvature/base/View';

export class Pak
{
	constructor(source)
	{
		this.source   = source || require('./sample.pak');
		this.doc      = document.createRange().createContextualFragment(this.source);
		this.sections = {};

		let elements = this.doc.querySelectorAll(
			`script[type="text/html"][data-level="section"]`
		);

		for(let i = elements.length; i--;)
		{
			this.section(elements[i].getAttribute('data-name'));
		}
	}

	section(name)
	{
		if(this.sections[name])
		{
			return this.sections[name];
		}

		let element = this.doc.querySelector(
			`script[type="text/html"][data-level="section"][data-name="${name}"]`
		);

		if(!element)
		{
			element = document.createElement('script');

			element.setAttribute('type',       'text/html');
			element.setAttribute('data-level', 'section');
			element.setAttribute('data-name',  name);

			this.doc.appendChild(element);
		}

		this.sections[name] = document.createRange().createContextualFragment(
			element.innerText.trim()
		);

		return this.sections[name];
	}

	template(name, newContent = false)
	{
		let section = this.section(name);
		let element = section.querySelector(
			`script[type="text/html"][data-level="template"]`
		);

		let content = '';

		if(element)
		{
			content = element.innerText.trim();
		}
		else
		{
			element = document.createElement('script');

			element.setAttribute('type',       'text/html');
			element.setAttribute('data-level', 'template');

			section.appendChild(element);
		}

		if(newContent !== false)
		{
			element.innerHTML = newContent;
		}

		return content;
	}

	style(name, newContent = false)
	{
		let section = this.section(name);
		let element = section.querySelector(`style`);

		let content = '';

		if(element)
		{
			content = element.innerText.trim();
		}
		else
		{
			element = document.createElement('style');

			section.appendChild(element);
		}

		if(newContent !== false)
		{
			element.innerText = newContent;
		}

		return content;
	}

	view(name, viewClass = null)
	{
		let style     = this.style(name);
		let view      = new (viewClass || View);
		let head      = document.querySelector('head');
		let headStyle = head.querySelector(`style[data-for="${name}"]`);

		if(!headStyle)
		{
			let newStyle       = document.createElement('style');
			newStyle.innerText = style;

			head.appendChild(newStyle);
		}

		view.template = this.template(name);

		return view;
	}

	export()
	{
		let div = document.createElement('div');

		for(let i in this.sections)
		{
			let script = document.createElement('script');

			script.setAttribute('type',       'text/html');
			script.setAttribute('data-level', 'section');
			script.setAttribute('data-name',  i);

			script.appendChild(this.sections[i].cloneNode(true));

			div.appendChild(script);
		}


		return div.innerHTML;
	}
}
