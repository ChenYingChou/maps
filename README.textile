"[Google Docs 文件說明連結在此]":http://docs.google.com/Doc?docid=0AUZg-tVAE8VuZGZjeno5cm1fNDg5aHh6dGp3Z3g&hl=zh_TW

<br>*2010/04/08(1):*
# 將物件中使用到 GMaps 的縮放等級屬性由 "depth" 改為 "zoom", 以符合 GMaps API 介面參數。
# 上述 Google Docs 中文件說明一併修訂。
# GMaps 中有關縮放等級(zoom level)的範圍不容易找到明確的大小, 似乎是20個等級。有一說法為 1~18, 加上下極距(0,19)共20等級。但根據 "[GMap API v2 升級指南]":http://code.google.com/intl/zh-TW/apis/maps/documentation/upgrade.html#ZoomLevelOrder 中卻說:<br>從 GMap 升級到 GMap2 縮放等級順序<br>GMap2 中的縮放等級索引是從 0 開始，這是最粗略的等級，而不是最佳等級。這樣可以允許任何高解析度，而讓我們可以更輕鬆地引進高解析度的圖片。您可以使用下列公式，在舊和新的縮放等級之間進行轉換：<br>@newZoom = 17 - oldZoom@

<br>*2010/04/08(2):*
# 請注意 AttrTypeMap.js 中的函式 AttrTypeMapFunc 已加上一個必要參數 elem, 是觸發者這個 DOM。在本應用系統中是指的是 Map 這個按鈕, 因此 HTML 中應寫:<br><pre>  @<button onclick="AttrTypeMapFunc(this)">Map</button>@
若是以 jQuery 來觸發則寫為如下:
  @$('#mapTrigger_{$oAttribute->name}').click(function(){
    AttrTypeMapFunc(this);
  });@
而不再是
  @<button onclick="AttrTypeMapFunc.call(this)">Map</button>@
或
  @$('#mapTrigger_{$oAttribute->name}').click(AttrTypeMapFunc);@
</pre>
# 舊有版本的寫法較適合使用 jQuery 寫作, 但若以 DOM onclick 的做法則似乎有點奇怪: onclick="AttrTypeMapFunc.call(this)"。這種寫法是執行 AttrTypeMapFunc 函式時, 把這個 button DOM 設為目前物件(this)。但再思考, 此時將這個 DOM 做為參數較不容易產生混淆, 畢竟 AttrTypeMapFunc 只是一個獨立函式, 要針對這個 DOM做某些動作, 並不須視為某一個物件的方法來執行。

<br>*2010/04/09:*
# AttrTypeMapFunc() 最後一定返回 false, 因此在按鈕事件觸發執行時會阻止原本預設動作(例如送出表單)。
# AttrTypeMap.php 產生的按鈕事件改為:<br>@onclick="return AttrTypeMapFunc(this)"@

<br>*2010/05/08:*
# 模版源碼(http://github.com/nje/jquery-tmpl)更新到  2010/05/01, 但第 45~47 行的 else 應註記掉: <br><pre>  @} /* else {
                fn = jQuery.tmpl( tmpl );
            } */@
</pre>
# 新模版的變數替換由 *<%= 物件屬性 %>* 改為 *${物件屬性}*, 更新 index.html 中的模版。
# gmaps.js 中先檢查若已載入 jQuery 就不再呼叫載入 Google AJAX jQuery, 同時也不再執行 @jQuery.noConflict()@。
 