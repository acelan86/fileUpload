(function ($) {
    /**
     * 拼装发送的文件体
     * @param  {String}         fieldname [发送的表单域名字]
     * @param  {String}         filename  [文件名]
     * @param  {BinaryString}   filedata  [文件二进制字符串]
     * @param  {String}         mime      [文件类型]
     * @param  {String}         boundary  [表单分隔符]
     * @return {String}                   [文件体]
     */
    function getUploadBody(fieldname, filename, filedata, mime, boundary) {
        var CRLF = '\r\n',
            body = '';

        body += '--' + boundary
                + CRLF;
        body += 'Content-Disposition: form-data; '
                + 'name="'+ fieldname + '"; '
                + 'filename="' + encodeURIComponent(filename) + '"'
                + CRLF;
        body += 'Content-Type: ' + mime
                + CRLF
                + CRLF;
        body += filedata
                + CRLF;
        body += '--' + boundary + '--'
                + CRLF;

        return body;
    }

    /**
     * 添加sendAsBinary方法
     * 以二进制方式发送数据
     */
    if ('function' !== typeof XMLHttpRequest.prototype.sendAsBinary) {
        XMLHttpRequest.prototype.sendAsBinary = function (data) {
            function byteValue(x) {
                return x.charCodeAt(0) & 0xff;
            }
            var ords = Array.prototype.map.call(data, byteValue),
                ui8a = new Uint8Array(ords);
            this.send(ui8a);
        };
    }
    /**
     * ajax方式发送文件       
     * @param  {String}     url         接收路径
     * @param  {Object}     params      参数，{name: 'xx', fo: fo}
     * @param  {Function}   callback    成功回调方法
     * @param  {Object}     opt         附加配置参数
     * @return {Null}       
     */
    $.ajaxUpload = function (url, params, callback, opt) {
        var xhr = new XMLHttpRequest(),
            data,
            fread,
            name = params.name,
            fo = params.fo;

        xhr.onload = function (e) {
            callback(e);
        };
        xhr.upload.onprogress = function (e) {
            console.debug(e);
        };

        xhr.open('post', url, true);
        if (!FormData) {
            data = new FormData();
            data.append(params.name, params.fo);
            xhr.send(data);
        } else {
            fread = new FileReader();
            fread.onload = function (e) {
                var boundary = '----AjaxUploadFormBoundary' + (+new Date());
                xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
                xhr.sendAsBinary(getUploadBody(name, fo.name, e.target.result, fo.type, boundary));
            }
            fread.readAsBinaryString(fo);
        }
    };
})(window);   