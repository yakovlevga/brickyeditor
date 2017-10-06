# BrickyEditor jQuery plugin
### BrickyEditor is the simple WYSIWYG editor, based on block templates system.

Usually, editors without any frontend background makes a lot of mistakes in html code.
On the other side - there is a lot of WYSIWYG editors, that brings them too much freedom, which leads to different appearence of publications.

**BrickyEditor** solve this problems: editors can use only prepared blocks of content and don't need to write any code.
Your longrids and articles will be in one clean style.

Since **BrickyEditor** can save blocks as JSON, not only in rendered HTML, you can easily deliver your content to mobile platforms 
and render it natively, without

![demo gif](https://github.com/yakovlevga/brickyeditor/blob/master/readme/1.gif?raw=true)

## Demo page
**[see demo for details](http://brickyeditor.info/examples.html)**

## Basic usage
1. Copy files from brickyeditor\build to your site folder.
2. Add `<script src="js/jquery.brickyeditor.js"></script>` to your page.
3. Add `<link rel="stylesheet" href="css/jquery.brickyeditor.min.css">` to your page.
4. If you don't have link to fontawesome, add it too ([http://fontawesome.io/](http://fontawesome.io/))
5. Call init code, when document is loaded
```js
$(function(){
  $("#editor").brickyeditor({
        templatesUrl: "path/to/base/templates/template.html" // by default it's "/templates/bootstrap4.html";
    });
});
```

## Template system

In current version there are 3 type of fields you can use inside your templates.
 - Html Field - *Any html tag with possibility to edit content with base formatting (bold, italic, links, lists).*
 - Image Field - *Div or img tag, that allows to upload image in base64 format.*
 - Embed Field - *Embed field for instagram, youtube, twitter and other providers. Based on [https://noembed.com](https://noembed.com) service.*
Fields tags should be marked with attribute `data-bre-field="{ 'name' : 'caption', 'type' : 'html'}"`, with field settings inside it. 

All templates should be placed inside `<div class="bre-template" data-name="Template Name"></div>`. 
If you want custom preview for your template, you could wrap preview html inside block `<div class="bre-template-preview"></div>`. BrickyEditor will render block with default values as preview if you don't add this block.

**Sample template**
```html
<div class="bre-template" data-name="Image with caption">
  <div class="bre-template-preview"><img src="templates/image-with-caption.jpg"/></div>

  <img data-bre-field="{ 'name' : 'image', 'type' : 'image', 'src' : 'assets/photo.jpg'}" />
  <figcaption data-bre-field="{ 'name' : 'caption', 'type' : 'html'}">Lorem ipsum dolor sit amet</figcaption>
</div>
```

In this sample two editable fields - img (field type - image) and figcaption (field type = html). 
Editor will get _templates/image-with-caption.jpg_ image as preview to render block inside tools panel.
You could find more examples in `build/templates folder`.
