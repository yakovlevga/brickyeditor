$.extend(BrickyEditor.EditorStrings, {
    errorBlocksFileNotFound: function(url) { return 'Не найден запрошенный файл с блоками. Указанный путь: ' + url; },
    errorTemplatesFileNotFound: function(url) { return 'Не найден файл с шаблонами блоков. Указанный путь: ' + url; },
    errorBlockTemplateNotFound: function (templateName) { return 'Шаблон блока "' + templateName + '" не найден.'; },
    errorTemplateParsing: function(name) { return 'Ошибка парсинга шаблона: ' + name; },

    embedFieldLinkTitle: 'Ссылка на встраиваемый элемент',

    imageFieldLinkTitle: 'Ссылка на картинку',
    imageFieldLinkPlaceholder: 'http://ссылка-на-картинку.png',
    
    imageFieldUploadTitle: 'или Загрузите файл',
    imageFieldUploadButton: 'Выбрать файл',

    imageFieldAltTitle: 'Альтернативный текст (alt)',
    imageFieldAltPlaceholder: 'Аттрибут \'alt\' для картинки',

    imageFieldUrlSubtitle: 'Ссылка для открытия по клику на картинку',

    htmlEditorLinkUrlTitle: 'Ссылка',
    htmlEditorLinkUrlPlaceholder: 'http://ваша-ссылка.здесь',

    htmlEditorLinkTitleTitle: 'Заголовок',
    htmlEditorLinkTitlePlaceholder: 'Значение атрибута title',

    htmlEditorLinkTargetTitle: 'Цель',
    htmlEditorLinkTargetBlank: 'В новом окне (_blank)',
    htmlEditorLinkTargetSelf: 'В текущем окне (_self)',
    htmlEditorLinkTargetParent: 'Во фрейме-родителе (_parent)',
    htmlEditorLinkTargetTop: 'В полном окне, игнорируя фреймы (_top)',

    buttonClose: 'закрыть',
    buttonOk: 'Ok',
    buttonCancel: 'Отмена',

    defaultTemplatesGroupName: 'Прочие шаблоны',
});