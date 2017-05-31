# BrickyEditor jQuery plugin
### BrickyEditor is the simple WYSIWYG editor, based on block templates system.

Usually, editors without any frontend background makes a lot of mistakes in html code.
On the other side - there is a lot of WYSIWYG editors, that brings them too much freedom, which leads to different appearence of publications.

**BrickyEditor** solve this problems: editors can use only prepared blocks of content and don't need to write any code.
Your longrids and articles will be in one clean style.

Since **BrickyEditor** can save blocks as JSON, not only in rendered HTML, you can easily deliver your content to mobile platforms 
and render it natively, without

## Demo page
[see demo for details](http://brickyeditor.info/examples.html)

## Basic usage
1. Copy files from brickyeditor\build to your site folder.
2. Add `<script src="js/jquery.brickyeditor.js"></script>` to your page.
3. Add `<link rel="stylesheet" href="css/jquery.brickyeditor.min.css">` to your page.
4. If you don't have link to fontawesome, add it too ([http://fontawesome.io/](http://fontawesome.io/))
5. Call init code, when document is loaded
```js
$(function(){
  $("#editor").brickyeditor({
        templatesBaseFolder: "path/to/base/templates/folder", // by default it's "/templates";
        templatesFolder: "path/to/templates/folder", // by default it's "/templates/bootstrap4";
    });
});
