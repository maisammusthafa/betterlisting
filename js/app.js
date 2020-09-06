$(document).ready(function () {
    // Working on nginx HTML and applying settings.
    var text = $('h1').text();
    var array = text.split('/');
    var last = array[array.length - 2];
    var dirStructure = $('a').text();
    var dirStructure = document.getElementsByTagName('a')[0].href;
    var dir = text.substring(10);
    var currentDir = (window.location.pathname === '/') ? 'index' : last;
    var dirTrun;

    // Truncate long folder names.
    if (currentDir.length > 19) {
        var currentDir = currentDir.substring(0, 18) + '...';
    }

    // Updating page title.
    document.title = currentDir + ' – ' + srvData['host'];

    // Updating page footer.
    const system_info = `${srvData['host']} running ${srvData['srv']} on ${srvData['os']}`;
    const disk_info = `disk: ${srvData['df']}G free of ${srvData['dt']}G`;

    $('#footerText').html(
        `<a href='/'>${system_info}</a>
        <br>
        <a href='/tinyfilemanager'>${disk_info}</a>`
    );

    // Add back button.
    $('h1').html(currentDir);

    if (dir.length > 60) {
        dirTrun = dir.replace(/(.{60})/g, '$1\n');
    } else {
        dirTrun = dir.substring(0, dir.length - 1);
    }

    // Add subtitle and back arrow.
    $('h1').append(
        `<h4>
            <a href='${dirStructure}'>
                <i class='nf nf-fa-chevron_left'></i>
            </a>
            <span>/${dirTrun}</span>
        </h4>`
    );

    // Add search box.
    $('h1').prepend(
        `<form id='custom-search-form' class='form-inline pull-right'>
            <div class='btn-group'>
                <input id='searchBox' placeholder='Search' type='search' class='form-control'>
                <i id='searchclear' class='nf nf-fa-remove'></i>
            </div>
        </form>`
    );

    // Add parent directory bit.
    $('a')
        .eq(1)
        .html('..');

    // Add titles.
    $('pre').prepend(
        `<div class='header'>Name${' '.repeat(51)}Time${' '.repeat(17)}Size</div>`
    );

    // Establish supported formats.
    var list = new Array();

    var formats = {
        '7z': ['archive', 'nf-fa-file_zip_o'],
        'apk': ['code', 'nf-mdi-android_head'],
        'avi': ['video', 'nf-fa-file_video_o'],
        'bin': ['misc', 'nf-oct-file_binary'],
        'c': ['code', 'nf-mdi-language_c'],
        'cpp': ['code', 'nf-mdi-language_cpp'],
        'cs': ['code', 'nf-mdi-language_csharp'],
        'css': ['code', 'nf-dev-css3_full'],
        'deb': ['archive', 'nf-linux-debian'],
        'doc': ['misc', 'nf-fa-file_word_o'],
        'docx': ['misc', 'nf-fa-file_word_o'],
        'epub': ['misc', 'nf-fae-book_open_o'],
        'exe': ['code', 'nf-fa-windows'],
        'gif': ['image', 'nf-fa-file_image_o'],
        'gz': ['archive', 'nf-fa-file_zip_o'],
        'gzip': ['archive', 'nf-fa-file_zip_o'],
        'heic': ['image', 'nf-fa-file_image_o'],
        'html': ['code', 'nf-dev-html5'],
        'iso': ['archive', 'nf-fae-disco'],
        'java': ['code', 'nf-fae-java'],
        'jpeg': ['image', 'nf-fa-file_image_o'],
        'jpg': ['image', 'nf-fa-file_image_o'],
        'js': ['code', 'nf-dev-javascript'],
        'json': ['code', 'nf-seti-json'],
        'mkv': ['video', 'nf-fa-file_video_o'],
        'mobi': ['misc', 'nf-fae-book_open_o'],
        'mp3': ['audio', 'nf-fa-file_audio_o'],
        'mp4': ['video', 'nf-fa-file_video_o'],
        'ogg': ['audio', 'nf-fa-file_audio_o'],
        'pdf': ['misc', 'nf-fa-file_pdf_o'],
        'php': ['code', 'nf-dev-php'],
        'png': ['image', 'nf-fa-file_image_o'],
        'ppt': ['misc', 'nf-fa-file_powerpoint_o'],
        'pptx': ['misc', 'nf-fa-file_powerpoint_o'],
        'psd': ['misc', 'nf-dev-photoshop'],
        'py': ['code', 'nf-mdi-language_python_text'],
        'rar': ['archive', 'nf-fa-file_zip_o'],
        'raw': ['misc', 'nf-oct-file_binary'],
        'sh': ['code', 'nf-oct-terminal'],
        'sql': ['code', 'nf-dev-mysql'],
        'srt': ['misc', 'nf-mdi-message_text_outline'],
        'tar': ['archive', 'nf-fa-file_zip_o'],
        'tgz': ['archive', 'nf-fa-file_zip_o'],
        'tiff': ['image', 'nf-fa-file_image_o'],
        'torrent': ['misc', 'nf-oct-cloud_download'],
        'txt': ['misc', 'nf-fa-file_text_o'],
        'wav': ['audio', 'nf-fa-file_audio_o'],
        'webm': ['video', 'nf-fa-file_video_o'],
        'webp': ['image', 'nf-fa-file_image_o'],
        'wma': ['audio', 'nf-fa-file_audio_o'],
        'wmv': ['video', 'nf-fa-file_video_o'],
        'xls': ['misc', 'nf-fa-file_excel_o'],
        'xlsx': ['misc', 'nf-fa-file_excel_o'],
        'yml': ['code', 'nf-mdi-code_brackets'],
        'zip': ['archive', 'nf-fa-file_zip_o'],
    };

    // Run when text is entered in the search box.
    $('#custom-search-form').on('input', function (e) {
        e.preventDefault();
        var target = $('#searchBox').val();
        filter(target);
    });

    // Instant search.
    function filter (target) {
        var parent_directory = '..';
        $('pre a').each(function () {
            var arraySearch = decodeURI($(this).attr('href'));

            // Check the href data for searched term. Using href because the link label truncates if the file or folder name is too long.
            // Special handling for 'Parent Directory' as the href data doesn't contain that word.
            if (
                arraySearch.toLowerCase().indexOf(target.toLowerCase()) > -1 ||
                ($(this).text() == '..' &&
                    parent_directory.indexOf(target.toLowerCase()) > -1)
            ) {
                $(this).show();
                $($(this)[0].nextSibling).css('display', 'inline');
            } else {
                $(this).hide();
                if ($($(this)[0].nextSibling).hasClass('hideMe')) {
                    $($(this)[0].nextSibling).css('display', 'none');
                } else {
                    $($(this)[0].nextSibling).wrap(
                        `<span class='hideMe' style='display:none'></style>`
                    );
                }
            }
        });
    }

    // Runs when clear button is hit.
    $('#searchclear').click(function () {
        $('#searchBox').val('');
        filter('');
    });

    // Scan all files in the directory, check the extensions and show the right MIME-type image.
    $('pre a').each(function () {
        var found = 0;
        var arraySplit = $(this)
            .attr('href')
            .split('.');
        var fileExt = arraySplit[arraySplit.length - 1];

        Object.keys(formats).forEach((extension, index) => {
            console.log(1);
            if (fileExt.toLowerCase() == extension.toLowerCase()) {
                found = 1;
                var oldText = $(this).text();
                $(this).html(
                    `<i class='nf ${formats[extension][1]}'></i></a>${oldText} `
                );
                $(this).addClass('format-' + formats[extension][0]);
                return;
            }
        })

        // Add an icon for the go-back link.
        if ($(this).text() == '..') {
            found = 1;
            var oldText = $(this).text();
            $(this).html(
                `<i class='nf nf-fa-chevron_up'></i>${oldText}`
            );
            return;
        }

        // Check for folders as they don't have extensions.
        if (
            $(this)
                .attr('href')
                .substr($(this).attr('href').length - 1) == '/'
        ) {
            found = 1;
            var oldText = $(this).text();
            $(this).addClass('format-folder');

            $(this).html(
                `<i class='nf nf-mdi-folder_multiple'></i>${oldText.substring(0, oldText.length - 1)} `
            );

            // Fix for annoying jQuery behaviour where inserted spaces are treated as new elements -- which breaks my search.
            var string = ' ' + $($(this)[0].nextSibling).text();

            // Copy the original meta-data string, append a space char and save it over the old string.
            $($(this)[0].nextSibling).remove();
            $(this).after(string);
            return;
        }

        // File format not supported by Better Listings, so let's load a generic icon.
        if (found == 0) {
            var oldText = $(this).text();
            $(this).html(
                `<i class='nf nf-fa-file_o'></i>${oldText} `
            );
            return;
        }
    });
});
