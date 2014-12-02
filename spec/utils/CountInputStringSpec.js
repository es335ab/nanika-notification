var assert = require('power-assert');

var Text = require('../../assets/js/utils/CountInputString');

describe('Text', function () {

  it('text max length', function () {
    var text = new Text({
      data: {
        text: new Array(202).join('a')
      }
    });
    assert(!text.isValid());
    assert(text.validationError === 'テキストは200文字までです'); //TODO メッセージ管理
  });
});



var $ = require('jquery');

function CountInputString(args){

  /*
  * 【インターフェース】
  * inputTargetId: input type="text"やtextareaにIDに付与してそのIDを渡す
  * limitedStringId: 制限文字数を明示的に出力する部分のDOMをIDで渡す
  * limitedStringSize: 上限文字数
  * callBackInputString: functionの場合は入力アクションの都度、入力内容を返す
  */

  this.$inputTargetId = $('#' + args.inputTargetId);
  this.$limitedStringId = $('#' + args.limitedStringId);
  this.limitedStringSize = Number(args.limitedStringSize);
  this.callBackInputString = (args.callBackInputString) ? args.callBackInputString :false;

  this.STATUS_STRINGS = {
    1: '文字まで',
    2: 'あと',
    3: '文字'
  };

  this.init();
};

var proto = CountInputString.prototype;

proto.init = function () {
  this.setLimitedStringStatus();
  this.eventInit();
};

proto.eventInit = function () {
  var that = this;

  this.$inputTargetId.keydown(function () {
    var inputVal = that.getInputVal(that.$inputTargetId.val());

    that.setLimitedStringStatus();
    if(that.callBackInputString){
      that.callBackInputString(inputVal);
    }
  });

  this.$inputTargetId.keyup(function () {
    var inputVal = that.getInputVal(that.$inputTargetId.val());

    that.setLimitedStringStatus();
    if(that.callBackInputString){
      that.callBackInputString(inputVal);
    }
  });

};

proto.setLimitedStringStatus = function () {
  var inputVal = this.getInputVal(this.$inputTargetId.val());

  if(!inputVal){
    this.$limitedStringId.html( this.limitedStringSize + this.STATUS_STRINGS[1] );

    return;
  }

  var remainingLength = this.limitedStringSize - inputVal.length;

  if(remainingLength < 0){
    this.$limitedStringId.html(
      this.STATUS_STRINGS[2] +
      '<span class="limitText">' + remainingLength + '</span>' +
      this.STATUS_STRINGS[3]
    );
  }else{
    this.$limitedStringId.html(
      this.STATUS_STRINGS[2] +
      remainingLength +
      this.STATUS_STRINGS[3]
    );
  }
};

proto.getInputVal = function (beforeProcessingVal) {
  var afterProcessingVal = beforeProcessingVal.replace((new RegExp('\r\n','g')),'');
  afterProcessingVal = afterProcessingVal.replace((new RegExp('\n','g')),'');

  return afterProcessingVal;
};

// export
module.exports = CountInputString;