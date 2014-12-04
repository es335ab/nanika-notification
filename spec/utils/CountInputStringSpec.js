var assert = require('power-assert');
var jsdom = require("jsdom");
var window = jsdom.jsdom().parentWindow;
var jquery = $ = require("jquery");

var CountInputString = require('../../assets/js/utils/CountInputString');

describe('CountInputStringSpec', function () {

  var stub1 = {
    inputTargetId: 'stubUserIdInput',
    limitedStringId: 'stubUserIdInputResult',
    limitedStringSize: 20
  }

  var countInputString = new CountInputString(stub1);

  it('入力文字数ごとのテスト', function () {
    var nullText = "";
    var hasText = "文字列が制限数以内入っています";
    var overText = new Array(22).join('a');

    assert(countInputString.setLimitedStringStatus(nullText) === false);
    assert(countInputString.setLimitedStringStatus(hasText) === 'あと5文字');
    assert(countInputString.setLimitedStringStatus(overText) === '<span class="limitText">あと-2文字</span>');
  });
});
