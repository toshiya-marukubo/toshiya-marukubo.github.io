export class setData {
  constructor(data) {
    this.main = document.getElementsByTagName('main')[0];
    this.data = data;
    this.initialize(data);
  }

  initialize(path) {
    const table = this.createElement('table', null);
    const caption = this.createElement('caption', 'Something');
    const thead = this.createElement('thead', null);
    const tbody = this.createElement('tbody', null);
    const tr = this.createElement('tr', null);
    const th = this.createElement('th', 'Image');
    const th2 = this.createElement('th', 'Number');
    const th3 = this.createElement('th', 'Category');
    const th4 = this.createElement('th', 'Link');
    const th5 = this.createElement('th', 'Code');
    const th6 = this.createElement('th', 'Reference');

    this.tbody = tbody;
    
    table.setAttribute('border', '1');
    tr.appendChild(th);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    tr.appendChild(th5);
    tr.appendChild(th6);

    thead.appendChild(tr);

    table.appendChild(caption);
    table.appendChild(thead);
    table.appendChild(tbody);

    this.main.appendChild(table);

    this.addItems();
  }
  
  createElement(elm, content) {
    const element = document.createElement(elm);

    if (content !== null) {
      element.textContent = content;
    }

    return element;
  }

  addItem(index) {
    const tr = this.createElement('tr', null);
    const td = this.createElement('td', null);
    const td2 = this.createElement('td', null);
    const td3 = this.createElement('td', null);
    const td4 = this.createElement('td', null);
    const td5 = this.createElement('td', null);
    const td6 = this.createElement('td', null);
    const a = this.createElement('a', 'View');
    const a2 = this.createElement('a', 'View the code ');
    const img = this.createElement('img', null);

    const span = this.createElement('span', this.data[index].description);
    span.classList.add('visually-hidden');
    const span3 = this.createElement('span', this.data[index].description);
    span3.classList.add('visually-hidden');
    
    const span2 = this.createElement('span', 'of');
    span2.classList.add('visually-hidden');

    const text2 = document.createTextNode('on GitHub');

    a.appendChild(span3);
    a2.appendChild(span2);
    a2.appendChild(span);
    a2.appendChild(text2);

    img.setAttribute('src', this.data[index].imagePath);
    img.setAttribute('width', '100');
    img.setAttribute('height', '100');
    img.setAttribute('alt', 'Thumbnail of ' + this.data[index].description);
    
    a.setAttribute('href', this.data[index].href);
    a2.setAttribute('href', this.data[index].git);
    a2.setAttribute('target', '_blank');
    a2.setAttribute('rel', 'noopener noreferrer');

    td2.textContent = this.data[index].day;
    td3.textContent = this.data[index].category;

    if (this.data[index].reference.text !== 'Not') {
      const a = this.createElement('a', this.data[index].reference.text);
      a.setAttribute('href', this.data[index].reference.link);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');

      td6.appendChild(a);
    } else {
      td6.textContent = this.data[index].reference.text;
    }

    td.appendChild(img);
    td4.appendChild(a);
    td5.appendChild(a2);

    tr.appendChild(td);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);

    this.tbody.appendChild(tr);
  }

  addItems() {
    for (let i = 0; i < this.data.length; i++) {
      this.addItem(i);
    }
  }
}
