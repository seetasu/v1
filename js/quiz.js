// 说明引用了谁的？

(function($) {
    var typeA = 0;
    typeB = 0;
    typeC = 0;
    typeD = 0;
    $.fn.jquizzy = function(settings) {
        var defaults = {      //一个json对象
            questions: null,
            endText: 'you have finished!',
            shortURL: null,
            sendResultsURL: null,
            pathDef: 'M16.667,62.167c3.109,5.55,7.217,10.591,10.926,15.75 c2.614,3.636,5.149,7.519,8.161,10.853c-0.046-0.051,1.959,2.414,2.692,2.343c0.895-0.088,6.958-8.511,6.014-7.3 c5.997-7.695,11.68-15.463,16.931-23.696c6.393-10.025,12.235-20.373,18.104-30.707C82.004,24.988,84.802,20.601,87,16',
            resultComments: {
                perfect: 'you are perfect',
                excellent: 'you are excellent',
                good: 'very good',
                average: 'just soso',
                bad: 'too bad',
                poor: 'terrible',
                worst: 'you are the worst'
            }
        };
        var config = $.extend(defaults, settings);
        if (config.questions === null) {
            $(this).html('<div class="intro-container slide-container"><h2 class="qTitle">Failed to parse questions.</h2></div>');
            return;
        } //如果没有输入题目的话，显示failed to parse questions。


        var superContainer = $(this),
        answers = [],
        introFob = '	<div class="intro-container slide-container"><div class="question"><div class="test-title"></div><div class="question-number">0.Basic</div><div class="question-text">Before the evaluation starts, please tell us some basic information about your company, we will recommend related cases to you.</div></div><div class="answers-wrap"></div><div class="start"><a class="nav-start" href="#"><img src="img/start.svg"></a></div></div></div>',
            //开始部分：认真答题，开始图片
            exitFob = '<div class="results-container slide-container"><div class="result-keeper"></div><div class="result-keeper2"></div><div class="download-stuff-wrapper">            <div id="download">                <div class="red-btn">                    Download This Report                </div>            </div>            <div id="share">                <p class="para">                    Share your report through:                </p>                <div class="social-media-row">                    <img src="img/social-twitter.png" alt="">                    <img src="img/social-facebook.png" alt="">                </div>            </div>            <div id="back-to-options">                <a href="index.html#other-options">                    <div class="scroll-wrapper">                        <img src="img/scroll-down-gray.png" alt="">                    </div>                    <p class="para">                        Check other options we offer                    </p>                </a>            </div>        </div></div></div><div class="notice">Please select your answer！</div>',
            //结束部分：results container里面有结束语，测试结果。提示“请选择”以及进度条也是在这一部分。通过hide和fadein来调出。
            contentFob = '',
            //内容部分
            questionsIteratorIndex,
            answersIteratorIndex;

            superContainer.addClass('main-quiz-holder');

        for (questionsIteratorIndex = 0; questionsIteratorIndex < config.questions.length; questionsIteratorIndex++) //从第0题开始，当前题目数小于题目总数时，执行以下代码，之后跳到下一题
        {

            contentFob += '<div class="slide-container"><div class="question">' + '<div class="test-title"></div>' + '<div class="question-number">' + (questionsIteratorIndex + 1) + '<span> / ' + config.questions.length + '</span></div><div class="question-text">'+ config.questions[questionsIteratorIndex].question +'</div></div><div class="answers-wrap"><ul class="answers">';
            //右上角的进度框，把回答依次parse出来。

            for (answersIteratorIndex = 0; answersIteratorIndex < config.questions[questionsIteratorIndex].answers.length; answersIteratorIndex++) 
            {
                contentFob += '<li><p class="answersLi">' + config.questions[questionsIteratorIndex].answers[answersIteratorIndex] + '</p><svg version="1.1" id="layer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 108.9 100" style="enable-background:new 0 0 108.9 36.9;" xml:space="preserve"><path d="M16.667,62.167c3.109,5.55,7.217,10.591,10.926,15.75 c2.614,3.636,5.149,7.519,8.161,10.853c-0.046-0.051,1.959,2.414,2.692,2.343c0.895-0.088,6.958-8.511,6.014-7.3 c5.997-7.695,11.68-15.463,16.931-23.696c6.393-10.025,12.235-20.373,18.104-30.707C82.004,24.988,84.802,20.601,87,16"></path></svg></li>';
            }
            //回答

            contentFob += '</ul></div>';
            //上下题 按钮开始
            
            if (questionsIteratorIndex !== 0) 
            {
                contentFob += '<div class="prev"><a class="nav-previous" href="#"><img src="img/up.svg"></a></div>';
            }//从第二题开始显示“上一题”
            

            if (questionsIteratorIndex < config.questions.length - 1) 
            {   
                contentFob += '<div class="next"><a class="nav-next" href="#"><img src="img/down.svg"></a></div>';
            } else {
                contentFob += '<div class="next final"><a class="nav-show-result" href="#"><img src="img/down.svg"></a></div>';
            }//从第一题开始显示“下一题”，最后一题时显示“完成”
            
            contentFob += '</div>';
            
            // answers.push(config.questions[questionsIteratorIndex].correctAnswer);
            //将用户输入的正确答案放入叫做answers的array里面。
        }


        superContainer.html(introFob + contentFob + exitFob);//将刚刚写好的所有东西放到html中

        var progress = superContainer.find('.progress'),
        progressKeeper = superContainer.find('.progress-keeper'),   
        notice = superContainer.find('.notice'),
        progressWidth = progressKeeper.width(),
        userAnswers = [],
        questionLength = config.questions.length,
        slidesList = superContainer.find('.slide-container');


        function seetaScore()
        {
            var resultSeeta = 0;

            for(i=0; i<5; i++)
            {
                if(userAnswers[i]==1)
                {
                    resultSeeta = resultSeeta + config.questions[i].answerWeight[0];
                }else if(userAnswers[i] == 2)
                {
                    resultSeeta = resultSeeta + config.questions[i].answerWeight[1];
                }else if(userAnswers[i] == 3)
                {
                    resultSeeta = resultSeeta + config.questions[i].answerWeight[2];
                }else if(userAnswers[i] == 4)
                {
                    resultSeeta = resultSeeta + config.questions[i].answerWeight[3];
                };
            }
            return resultSeeta;
        }
        

        function judgeSkills(score) {
            var returnString;
            if (score === 100) return config.resultComments.perfect;
            else if (score > 90) return config.resultComments.excellent;
            else if (score > 70) return config.resultComments.good;
            else if (score > 50) return config.resultComments.average;
            else if (score > 35) return config.resultComments.bad;
            else if (score > 20) return config.resultComments.poor;
            else return config.resultComments.worst;
        }//依据分数判定结果的函数

        progressKeeper.hide();
        notice.hide();//进度条和提示语句最开始都是隐藏的

        slidesList.hide().first().fadeIn(50);//所有带有slide-container类的div先全部隐藏起来，然后其中的第一个淡入。

        superContainer.find('li').children('p').click(function() //找到所有的li元素，点击它们的时候
        {
            var thisP = $(this);
            if (thisP.parents('li').hasClass('selected')) 
            {
                thisP.parents('li').removeClass('selected');//如果原来选中了，就取消选择，
                thisP.parents('li').children('svg').hide();
            } else {
                thisP.parents('li').parents('.answers').children('li').removeClass('selected');//如果没有选中，它的父级元素下面的所有li的“选中”类都要去掉
                thisP.parents('li').parents('.answers').children('li').children('svg').hide();
                thisP.parents('li').addClass('selected');//然后把点击到的这一列添加“选中”类
                thisP.parents('li').children('svg').show();
                thisP.parents('li').children('svg').addClass('js-animate');
                // thisP.next('svg').children('path').attr('d', pathDef);
            }
        });

        var questionIdx = 0;

        superContainer.find('.nav-start').click(function() //点击开始标签时
        {
            questionIdx ++;
            animateIllustration();
            $('.dropdown-container').hide();
            $(this).parents('.slide-container').fadeOut(200, 
                function() {
                    $(this).next().fadeIn(50);
                    progressKeeper.fadeIn(50);
                });//其父级元素淡出，父级元素的下一个sibling元素淡入，进度条淡入
            return false;
        });

        // var illustration = {
        //     "illustration": {
        //         "strokepath": [
        //         {
        //             "path": " M22,43.1c0,62.6-4.5,145-4.5,181.9c0,19.3,0,23,26.5,23c115.9,0,214.9,4.5,322.4,0.2",
        //             'strokeColor': '#4d4d4d',
        //             'strokeWidth': 2,
        //             "duration": 2000,
        //         },
        //         {
        //             "path": " M24,39.6c43.7-5.9,82.8-4,121.5-3.2c66.9,1.4,128-0.9,194.9-0.9c38.9,0,36.7,0,36.7,49.7        c0,68.2-1.6,106.6-5.4,159.2",
        //             'strokeColor': '#4d4d4d',
        //             'strokeWidth': 2,
        //             "duration": 2000,
        //         },
        //         {
        //             "path": " M18.4,183.9c113.9-1.2,243-1.2,356.9-0.1",
        //             'strokeColor': '#4d4d4d',
        //             'strokeWidth': 2,
        //             "duration": 2000,
        //         },
        //         {
        //             "path": " M162.1,36.9c-1.2,14-2.3,114.3,0,146",
        //             'strokeColor': '#4d4d4d',
        //             'strokeWidth': 2,
        //             "duration": 2000,
        //         },
        //         {
        //             "path": " M235.4,39.1c-1.8,48.9-1.4,95,1,143.8",
        //             'strokeColor': '#4d4d4d',
        //             'strokeWidth': 2,
        //             "duration": 2000,
        //         },
        //         {
        //             "path": " M88.3,36.9C87,86.5,86.7,133.3,87.6,183",
        //             'strokeColor': '#4d4d4d',
        //             'strokeWidth': 2,
        //             "duration": 2000,
        //         },
        //         {
        //             "path": " M308.7,35.6c4.9,57.6,2.7,108.5,0.9,147.9",
        //             'strokeColor': '#4d4d4d',
        //             'strokeWidth': 2,
        //             "duration": 2000,
        //         },
        //         {
        //             "path": " M195.1,183.5c-0.4,24.3-0.3,42.4,0.2,66.6",
        //             'strokeColor': '#4d4d4d',
        //             'strokeWidth': 2,
        //             "duration": 2000,
        //         },
        //         {
        //             "path": " M87.4,104.4c22.9-0.8,50.5-0.4,73.4,0.9",
        //             'strokeColor': '#4d4d4d',
        //             'strokeWidth': 2,
        //             "duration": 2000,
        //         },
        //         {
        //             "path": " M234.3,105.4c24.8,0,52.9,0,77.4,0",
        //             'strokeColor': '#4d4d4d',
        //             'strokeWidth': 2,
        //             "duration": 2000,
        //         } 
        //         ],
        //         "dimensions": {
        //             "width": 398,
        //             "height": 267
        //         }
        //     }
        // };
        var partners = {
            "partners": {
                "strokepath": [
                    {
                        "path": " M54.9,65.4c-7,8.6-9.7,13.6-15.3,22.9c12.4-8,18.5-14.9,31-22.9c-10.4,16.3-21,32.6-31.6,48.8    C54.9,96.6,70,81.6,89.7,68.3c-17.3,28-28.9,53.1-48.9,79.1c22.9-21.9,41.4-46.3,61.3-70.9c-20.5,35.8-38.2,69.9-60.7,104.3    c22.1-23.5,41.5-53.4,63.7-76.9c-8,19.8-23.3,46.5-34.5,64.5c-9,14.4-18.3,25.5-27.2,39.9c22.6-25.5,35.8-49.1,60.9-72.1    C85.2,165,71,194.1,51.9,222.9c16-15.4,35.6-35.6,51.6-51C95,189,83,208.1,74.4,225.2c6.6-10.1,21.9-18.4,30.5-26.7    c-1.5,8.1-4.2,18.8-6.5,23.3",
                        'strokeColor': '#263248',
                        'strokeOpacity': '0.2',                
                        'strokeWidth': 22,
                        "duration": 2000,
                    }
                ],
                "dimensions": {
                    "width": 500,
                    "height": 310
                }
            }
        };
        var valueProposition = {
            "valueProposition": {
                "strokepath": [
                    {
                        "path": " M218.5,65.4c-7.1,9.1-10.7,17.2-17.3,26.5C217,79.8,224.1,72.5,241.9,63c-17.7,23.6-20.3,38.7-40.7,60.1    c26.5-24.6,38.4-42.7,70.1-60.1c-26.1,32.2-38.7,54.5-64.8,86.7c28.9-25.4,41-41.8,73.9-61.7c-25.5,39.6-50.5,59.4-73,94.9    c23.4-24,42.3-37.1,70.4-55.3c-24,37.4-49.3,54.7-70.4,89.7c24.6-24.8,38.3-38.2,67.8-56.8c-14.9,21.9-30.8,42.8-47.9,63.1    c15.9-15.3,29.5-26.2,49.3-36.1c-7,13.1-19,25.6-22.9,37.9c4.7-2.5,17.5-7.6,21.5-11.2",
                        'strokeColor': '#263248',
                        'strokeOpacity': '0.2',                
                        'strokeWidth': 22,
                        "duration": 2000,
                    }
                ],
                "dimensions": {
                    "width": 500,
                    "height": 310
                }
            }
        };
        var activities = {
            "activities": {
                "strokepath": [
                    {
                        "path": " M133.7,63c-5.3,6-7.5,12.1-12.8,18.2c11.8-8.7,18-12.3,31.5-18.2c-10.9,12.2-23.3,24.3-33.6,36.9    C137.1,86.5,152,73.2,172.3,63c-19.3,18.7-31.5,37.6-50.5,56.5c23.9-19.9,41.8-38.4,69.2-53.4c-0.1,3.9-42.8,43.4-62.9,62.8    c21.4-18.4,41.9-31.6,65.8-46.5c-24.1,22.1-22.6,26.6-46.8,48.8c23.6-16.3,29.4-18.7,45.4-25.4c-15,16-17.9,18.5-22.9,25.4l21.3-9.2",
                        'strokeColor': '#263248',
                        'strokeOpacity': '0.2',                
                        'strokeWidth': 22,
                        "duration": 2000,
                    }
                ],
                "dimensions": {
                    "width": 500,
                    "height": 310
                }
            }
        };
        var revenue = {
            "revenue": {
                "strokepath": [
                    {
                        "path": " M260.7,237.2c-8.2,8.5-6.7,14.8-14.9,23.1c14.9-11.3,17.7-17,35.7-21.9c-14.4,16.2-18.7,27.6-33.1,43.8    c22.6-16.4,35.4-33.6,60.9-45c-21.9,21.9-33.6,38.7-55.5,60.7c22-18.5,73.3-57.2,86.3-60.7c-21.6,24.9-39.7,38.9-65,61.6    c42.5-28.4,49.5-41.8,95.9-59.6c-32.7,25.6-37.7,34-70.4,59.6c40.4-27.6,57.5-37.2,101.1-59.2c-26.7,25.5-46,34.2-73.4,59.2    c32.8-22.1,72.8-44.5,109.1-61.6c-27.7,19.7-53.6,40.5-80.3,61.6c25.2-17.4,52.2-31.7,81.2-41.9c-17.5,16-34.9,24.6-50.1,41    c19.4-7.6,29.6-20.1,48.6-28.2c-9.3,12.1-10.4,22.4-14.9,29.1c9.3-5.5,14.7-7.1,18.5-12.3",
                        'strokeColor': '#263248',
                        'strokeOpacity': '0.2',                
                        'strokeWidth': 22,
                        "duration": 2000,
                    }
                ],
                "dimensions": {
                    "width": 500,
                    "height": 310
                }
            }
        };
        var relationships = {
            "relationships": {
                "strokepath": [
                    {
                        "path": " M307.3,63c-5.3,6-7.5,12.1-12.8,18.2c11.8-8.7,18-12.3,31.5-18.2c-10.9,12.2-23.3,24.3-33.6,36.9    c18.3-13.4,33.2-26.7,53.5-36.9c-19.3,18.7-31.5,37.6-50.5,56.5c23.9-19.9,41.8-38.4,69.2-53.4c-0.1,3.9-42.8,43.4-62.9,62.8    c21.4-18.4,41.9-31.6,65.8-46.5c-24.1,22.1-22.6,26.6-46.8,48.8c23.6-16.3,29.4-18.7,45.4-25.4c-15,16-17.9,18.5-22.9,25.4l21.3-9.2",
                        'strokeColor': '#263248',
                        'strokeOpacity': '0.2',                
                        'strokeWidth': 22,
                        "duration": 2000,
                    }
                ],
                "dimensions": {
                    "width": 500,
                    "height": 310
                }
            }
        };
        
        $('#partners').hide();
        $('#valueProposition').hide();
        $('#relationships').hide();
        $('#revenue').hide();
        $('#activities').hide();
        $('#sensing').hide();
        $('#orchestrating').hide();
        $('#conceptualizing').hide();
        $('#scaling').hide();
        $('#context').hide();


        $('.business-model-overlay').hide();
        $('.skill-overlay').hide();
        $('.context-overlay').hide();
        $('#overlay-close-business').click(function(){
            $('.business-model-overlay').css("display","none");
        });
        $('#overlay-close-skill').click(function(){
            $('.skill-overlay').css("display","none");
        });
        $('#overlay-close-context').click(function(){
            $('.context-overlay').css("display","none");
        });
        
        function animateIllustration(){
            if(questionIdx==1){
                $('.business-model-overlay').fadeIn(200);
                $('.business-model-overlay').css("z-index","1");
                $('#partners').fadeIn(200);
                $('#valueProposition').hide();
                var $partners = $('#partners');
                $partners.lazylinepainter({
                    'svgData': partners,
                    'strokeWidth': 22,
                    'strokeOpacity': 0.2,
                    'strokeColor': '#ed1c24',
                    'drawSequential': false,
                    'ease': 'easeInOutQuad'
                });
                $partners.lazylinepainter('paint');
            }
            if(questionIdx==2){
                $('#partners').hide();
                $('#valueProposition').fadeIn(200);
                var $valueProposition = $('#valueProposition');
                $valueProposition.lazylinepainter({
                    'svgData': valueProposition,
                    'strokeWidth': 2,
                    'strokeColor': '#b5287b',
                    'drawSequential': false,
                    'ease': 'easeInOutQuad'
                });
                $valueProposition.lazylinepainter('paint');
            }
            if(questionIdx==3){
                $('#valueProposition').hide();
                $('#relationships').fadeIn(200);
                var $relationships = $('#relationships');
                $relationships.lazylinepainter({
                    'svgData': relationships,
                    'strokeWidth': 2,
                    'strokeColor': '#b5287b',
                    'drawSequential': false,
                    'ease': 'easeInOutQuad'
                });
                $relationships.lazylinepainter('paint');
            }
            if(questionIdx==4){
                $('#relationships').hide();
                $('#revenue').fadeIn(200);
                var $revenue = $('#revenue');
                $revenue.lazylinepainter({
                    'svgData': revenue,
                    'strokeWidth': 2,
                    'strokeColor': '#b5287b',
                    'drawSequential': false,
                    'ease': 'easeInOutQuad'
                });
                $revenue.lazylinepainter('paint');
            }
            if(questionIdx==5){
                $('#revenue').hide();
                $('#activities').fadeIn(200);
                var $activities = $('#activities');
                $activities.lazylinepainter({
                    'svgData': activities,
                    'strokeWidth': 2,
                    'strokeColor': '#b5287b',
                    'drawSequential': false,
                    'ease': 'easeInOutQuad'
                });
                $activities.lazylinepainter('paint');
            }

            if(questionIdx==6){
                $('.skill-overlay').fadeIn(200);
                $('.skill-overlay').css("z-index","1");
                $('#activities').hide();
                $('#sensing').fadeIn(200);
            }
            if(questionIdx==7){
                $('#sensing').hide();
                $('#orchestrating').fadeIn(200);
            }
            if(questionIdx==8){
                $('#orchestrating').hide();
                $('#conceptualizing').fadeIn(200);
            }
            if(questionIdx==9){
                $('#conceptualizing').hide();
                $('#scaling').fadeIn(200);
            }
            if(questionIdx==10){
                $('.context-overlay').fadeIn(200);
                $('.context-overlay').css("z-index","1");
                $('#scaling').hide();
                $('#context').fadeIn(200);
            }

            // if(questionIdx==3){
            //     var $BMsections = $('#BMsections');
            //     $BMsections.lazylinepainter({
            //         'svgData': VP,
            //         'strokeWidth': 2,
            //         'strokeColor': '#b5287b',
            //         'drawSequential': false,
            //         'ease': 'easeInOutQuad'
            //     });
            //     $BMsections.lazylinepainter('paint');
            // }
        }

        superContainer.find('.next').click(function() //点击“下一题”时
        {   
            
            if ($(this).parents('.slide-container').find('li.selected').length === 0) 
            {
                notice.fadeIn(200);//如果没有选中，提示淡入
                return false;
            }else{
                questionIdx ++;
                animateIllustration();   
            }

            notice.hide();//隐藏提示


            $(this).parents('.slide-container').fadeOut(200,
                function() {
                    $(this).next().fadeIn(200);
                });//本题淡出，下题淡入

            progress.animate({
                width: progress.width() + Math.round(progressWidth / questionLength)
            },
            50);//进度条出现
            return false;
        });

        superContainer.find('.prev').click(function() //点击  上一题
        {
            questionIdx = questionIdx-1;
            animateIllustration();
            notice.hide();
            $(this).parents('.slide-container').fadeOut(200,
                function() {
                    $(this).prev().fadeIn(200);
                });
            progress.animate({
                width: progress.width() - Math.round(progressWidth / questionLength)
            },
            50);
            return false;
        });

        

        superContainer.find('.final').click(function() //点击“完成”按钮的时候
        {
            if ($(this).parents('.slide-container').find('li.selected').length === 0) {
                notice.fadeIn(200);
                return false;
            }//如果最后一题没有选项，先提醒选择

            superContainer.find('li.selected').each(function(index) {
                userAnswers.push($(this).parents('.answers').children('li').index($(this).parents('.answers').find('li.selected')) + 1);
                //找到选中元素，每个选中元素执行下面方法：
                //找到选中元素的父级元素 answers
                //找到answers的子级元素li，成为选择器
                //找到选中元素的父级元素，在从父级元素中找到选中元素。
                //选中元素相对于选择器li的index（从0开始）
                //index+1之后等于用户选择的第index+1个答案，push到useransers这个数组里面。
            });//useranswers这个数组例如[2，2，1，3]

            if (config.sendResultsURL !== null) {
                var collate = [];
                for (r = 0; r < userAnswers.length; r++) {
                    collate.push('{"questionNumber":"' + parseInt(r + 1, 10) + '", "userAnswer":"' + userAnswers[r] + '"}');
                }
                $.ajax({
                    type: 'POST',
                    url: config.sendResultsURL,
                    data: '{"answers": [' + collate.join(",") + ']}',
                    complete: function() {
                        console.log("OH HAI");
                    }
                });
            }

            progressKeeper.hide();//隐藏掉进度条

            var resultSet = '',
            shareButton = '',
            score,
            scoreSeeta,
            url;


            for(i=0; i<userAnswers.length; i++)
            {
                if ( userAnswers[i]==1 )
                {
                    typeA ++;
                };
                if ( userAnswers[i]==2 )
                {
                    typeB ++;
                };
                if ( userAnswers[i]==3 )
                {
                    typeC ++;
                };
                if ( userAnswers[i]==4 )
                {
                    typeD ++;
                };
            }

            var typeArray=[];

            
            if (config.shortURL === null) {
                config.shortURL = window.location
            };

            // 显示单题答案
            // for (var i = 0; i < 7; i++) 
            // {
            //     resultSet += '<div class="result-row">' + '<div class="correct">#'+(i + 1)+'-'+userAnswers[i]+'</div></div>';
            // }

            var bar_container = '<h2 class="section-title">ANALYSIS REPORT</h2><hr class="section-title-hr"></hr><div class="bm-type"><div class="bm-type-name-scentence"><p>Your business model is inclined to be type <br><span id="bm-type-name"></span></p></div><div class="bm-type-bar-charts"><ul class="result-ul"><li><div class="type-name-double"><p>Pushing<br>Harder</p></div><div class="bars"><div id="ph_bar"></div><div class="percentage"><p id="ph-percentage">20%</p></div></div><div style="clear: both;"></div></li><li><div class="type-name-single"><p>Reframing</p></div> <div class="bars"><div id="rf_bar"></div><div class="percentage"><p id="rf-percentage">50%</p></div></div><div style="clear: both;"></div></li><li><div class="type-name-double"><p>Pushing<br>Something Else</p></div> <div class="bars"><div id="pse_bar"></div> <div class="percentage">   <p id="pse-percentage">10%</p> </div></div>        <div style="clear: both;"></div>      </li>     <li>   <div class=" type-name-single"><p>Servicing</p>  </div>  <div class="bars"> <div id="svc_bar"></div>  <div class="percentage">   <p id="svc-percentage">20%</p>  </div>  </div>    <div style="clear: both;"></div>   </li>   </ul> </div>  </div></div>';


            var ResultPushingHarder='<div class="tips-container" id="tips-description">            <p class="para">                Based on your answers we conclude you have a businessmodel based on <b>'+'pushing harder'+'</b>. This means you have a great, innovative solution and you’re convinced you can help many potential clients with it. However, it is hard to convince your prospect of their problems, let alone create a mass market with it.                 <br>                You experience a bad (slow?) uptake and your reaction is to push your solution harder by strengthening your marketing and sales force. However, this effort isn’t rewarded with a better uptake.            </p>        </div>        <div class="tips-container" id="tips-bm">            <h2 class="tips-title">                Tips for Business Model            </h2>            <p class="para">You might consider the following:</p>            <ul class="tips-bm-list">                <li>                    <p class="para">                        Your clients might not be aware of having a ‘problem’, or are not as interested in your high tech solution as you want them to be. Try to find out what it is he’s interested in and the words he’s using for that. Here you can find some suggestions on how to do this. <a href="">[link]</a>                    </p>                </li>                <li>                    <p class="para">                        Find partners who can improve your value proposition, instead of filling the gaps in the value chain. These partners might be able to create the benefits your client is looking for.                    </p>                 </li>                <li                    <p class="para">                        Map your clients ‘customer journey’. Or, in other words, flesh out the orientation, considering, buying and using steps of your client. For each step, try to find out how you’re helping your client and what you can do to improve this process and help your client to buy and use your solution. Tip: involve a few of your clients in this process. <a href="">[link to toolkit]</a>                    </p>                </li>            </ul>        </div>                                <div class="tips-container" id="tips-skill">            <h2 class="tips-title">  Tips for Capabilities  </h2>            <div class="tip-skills-row">                <div id="sensing">                    <h2 class="para-title">                        Sensing User Need                    </h2>                    <p class="para">                        It might be worth it interviewing clients and lost prospects on what they think, feel and expect according to energy efficiency, what kind of solutions they have or already tried and so on. Ask ten, not one. Be open to the gaps you find with your offer.                     </p>                    <img src="img/icon-sensing.svg">                </div>                <div id="orchestrating">                    <h2 class="para-title">                        Orchestrating                    </h2>                    <p class="para">                        To your clients, your offer is service, not a tech-feature. Learn how they get in touch with the offer, how they want to buy it and how they prefer to use it, and try to meet them in their preferences.<br><br/>                      </p>                    <img src="img/icon-orchestrating.svg">                </div>                <div id="conceptualizing">                    <h2 class="para-title">                        Conceptualizing                    </h2>                    <p class="para">                        You’d be surprised to learn the willingness of some of your clients to reflect on some of your new ideas. Look them up and show them your sketches. Stimulate them to be completely honest to you.  <br><br/>                       </p>                    <img src="img/icon-conceptualizing.svg">                </div>            </div>        </div>                               <div class="tips-container" id="tips-context-cases">            <div class="tips-context">                <h2 class="tips-title">                    Tips for Company Context                </h2>                <p class="para">                    It not easy to change or bend rules. However, you might consider finding some stakeholders who are in the same level as you are. What will you gain if you work together?                </p>            </div            <div class="tips-cases">                <h2 class="tips-title">                    Related Cases                </h2>                <p class="para">                    <a href="">                        Philips in Netherlands                    </a>                </p>                <p class="para">                    <a href="">                        Retrofitting Energy in Sweden                    </a>                </p>            </div>        </div>';

            var ResultReframing = '<div class="tips-container" id="tips-description">            <p class="para">                Based on your answers we conclude you have a business model based on <b>‘reframing’</b>. This means you are aware that you can reach a larger group of customers by offering other benefits besides energy efficiency. By emphasizing other benefits and/or cooperating with partners who can deliver on these benefits, you have improved your business and increased your client base. You’ve met your clients by helping them making the right choice.            </p>        </div>        <div class="tips-container" id="tips-bm">            <h2 class="tips-title">                Tips for Business Model            </h2>            <p class="para">If you still facing a bad uptake or you want to enter new or other markets, you might consider the following:</p>            <ul class="tips-bm-list">                <li>                    <p class="para">                        Your might have met clients by helping them while orienting and buying. However, they will become users. What can you do after the deal is closed?                    </p>                </li>                <li>                    <p class="para">                        Invite your clients to become a part of your business in a structured way. Ask them to provide all kinds of input and be sure you                     </p>                 </li>                <li                    <p class="para">                        Map your clients ‘customer journey’. Or, in other words, flesh out the orientation, considering, buying and using steps of your client. For each step, try to find out how you’re helping your client and what you can do to improve this process and help your client to buy and use your solution. Tip: involve a few of your clients in this process. <a href="">[link to toolkit]</a>                    </p>                </li>            </ul>        </div>                    <div class="tips-container" id="tips-skill">            <h2 class="tips-title">  Tips for Capabilities  </h2>            <div class="tip-skills-row">                <div id="sensing">                    <h2 class="para-title">                        Sensing User Need                    </h2>                    <p class="para">                        Your clients aren’t just buyers of your solution, they’re also users. Try to understand how they prefer to use your solution and try to find out how you can help them using it in their preferred way.  </p>                    <img src="img/icon-sensing.svg">                </div>                <div id="orchestrating">                    <h2 class="para-title">                        Orchestrating                    </h2>                    <p class="para">                        Do you know how your clients experience your offer? Do you know how they would like to experience your offer? Do you know how you can improve? <br><br/>                      </p>                    <img src="img/icon-orchestrating.svg">                </div>                <div id="conceptualizing">                    <h2 class="para-title">                        Conceptualizing                    </h2>                    <p class="para">                       The ‘user journey’ provides lots of information about possible improvements. Try to identify them and<br><br/><br/>                       </p>                    <img src="img/icon-conceptualizing.svg">                </div>            </div>        </div>                   <div class="tips-container" id="tips-context-cases">            <div class="tips-context">                <h2 class="tips-title">                    Tips for Company Context                </h2>                <p class="para">                    It not easy to change or bend rules. However, you might consider finding some stakeholders who are in the same level as you are. What will you gain if you work together?                </p>            </div>            <div class="tips-cases">                <h2 class="tips-title">                    Related Cases                </h2>                <p class="para">                    <a href="">                        Philips in Netherlands                    </a>                </p>                <p class="para">                    <a href="">                        Retrofitting Energy in Sweden                    </a>                </p>            </div>        </div>';

            var ResultPushingSomethingElse = '<div class="tips-container" id="tips-description">            <p class="para">                Based on your answers we conclude you have a businessmodel based on <b>'+'pushing something else'+'</b>. You have learned a lot since you first started your business. Since then, you have adjusted several parts of your business model and you keep on doing this. You understand that a solid client relation is the fundament underneath your business, so you work hard to meet the clients expectations every day. You have several healthy partnerships who can really strengthen your business. Your clients are extremely valuable to you. You invite them to co-create new offers and reflect on your business.             </p>        </div>        <div class="tips-container" id="tips-bm">            <h2 class="tips-title">                Tips for Business Model            </h2>            <p class="para">If you are interested there is still room to improve the service orientedness of you business,You might consider the following:</p><ul class="tips-bm-list"><li><p class="para">Try to set up/ become part of a network with other businesses so you can deliver multiple values for your users.</p></li><li>                <p class="para">      Experiment in using users as starting point for your business to truly fulfill their needs. Listen to what they ask for and try if you can serve them in their needs. in an iterative process of building-testing-learning-improving.                    </p>                 </li>                <li>                    <p class="para">                        Try to focus on the experience of using energy efficiency ad all the needs around it in the lives of your clients, in all the using phases. From orientation to transaction, to use and even towards the end phase of using.                    </p>                </li>            </ul>        </div>                    <div class="tips-container" id="tips-skill">            <h2 class="tips-title">  Tips for Capabilities  </h2>            <div class="tip-skills-row">                <div id="sensing">                    <h2 class="para-title">                        Sensing User Need                    </h2>                    <p class="para">                        Your clients aren’t just buyers of your solution, they’re also users. Try to understand how they prefer to use your solution and try to find out how you can help them using it in their preferred way.  </p>                    <img src="img/icon-sensing.svg">                </div>                <div id="orchestrating">                    <h2 class="para-title">                        Orchestrating                    </h2>                    <p class="para">                        Do you know how your clients experience your offer? Do you know how they would like to experience your offer? Do you know how you can improve? <br><br/>                      </p>                    <img src="img/icon-orchestrating.svg">                </div>                <div id="conceptualizing">                    <h2 class="para-title">                        Conceptualizing                    </h2>                    <p class="para">                       The ‘user journey’ provides lots of information about possible improvements. Try to identify them and<br><br/>                       </p>                    <img src="img/icon-conceptualizing.svg">                </div>            </div>        </div>            ';

            var ResultServicing = '<div class="tips-container" id="tips-description">            <p class="para">                Based on your answers during this test, your business model is <b>'+'fit to serve'+'</b>. Recent research shows that business models like yours are often more successful than the product oriented ones. We’re excited when we meet new businesses who have a fit to serve business model, because we believe that many other entrepreneurs can benefit from your experience.                 <br>                The fundament underneath your business are your clients/users. You always try to find a way to serve them. The relationship between you and your clients is really valuable and based on trust.                 <br>                You might find difficulties in maintaining this trusted relationship with your clients when your business is growing and the client base is increasing.                 <br>                To a entrepreneur who is not (yet) fit to serve, your company might be an inspiration. Would you like to help others in creating a more service oriented business by sharing your learning with them (and us) on how you have become fit to serve?             </p>        </div>';

            scoreSeeta = seetaScore();

            resultSet = bar_container  + resultSet + '<div class="jquizzy-clear"></div>';
            
            superContainer.find('.result-keeper').html(resultSet).show(50);


            typeArray = [typeA, typeB, typeC, typeD];
            var userType = Math.max.apply(Math,typeArray);

            if(userType == typeA){
                superContainer.find('#bm-type-name').html('Pushing Harder.');
                superContainer.find('.result-keeper2').html(ResultPushingHarder);
            }else if(userType == typeB){
                superContainer.find('#bm-type-name').html('Reframing.');
                superContainer.find('.result-keeper2').html(ResultReframing);
            }else if(userType == typeC){
                superContainer.find('#bm-type-name').html('Pushing Something Else.');
                superContainer.find('.result-keeper2').html(ResultPushingSomethingElse);
            }else if(userType == typeD){
                superContainer.find('#bm-type-name').html('Servicing.');
                superContainer.find('.result-keeper2').html(ResultServicing);
            }

            var questionNumber = typeA+typeB+typeC+typeD;

            var pctA = Math.floor(typeA/questionNumber*100);
            var pctB = Math.floor(typeB/questionNumber*100);
            var pctC = Math.floor(typeC/questionNumber*100);
            var pctD = Math.floor(typeD/questionNumber*100);

            if((pctA+pctB+pctC+pctD) != 100){
                var minPct = Math.min(pctA,pctB,pctC,pctD);
                if(minPct == pctA){
                    pctA = pctA + (100-pctA-pctB-pctC-pctD);
                }else if(minPct == pctB){
                    pctB = pctA + (100-pctA-pctB-pctC-pctD);
                }else if(minPct == pctC){
                    pctC = pctA + (100-pctA-pctB-pctC-pctD);
                }else if(minPct == pctD){
                    pctD = pctA + (100-pctA-pctB-pctC-pctD);
                } 
            }

            superContainer.find('#ph-percentage').html(pctA+'%');
            superContainer.find('#rf-percentage').html(pctB+'%');
            superContainer.find('#pse-percentage').html(pctC+'%');
            superContainer.find('#svc-percentage').html(pctD+'%');
            
            $('.animation').hide();

            var widthA = pctA/100*660,
                widthB = pctB/100*660,
                widthC = pctC/100*660,
                widthD = pctD/100*660;

            if(widthA ==660 || widthB ==660 || widthC ==660 || widthD ==660){
                $('#ph_bar').css("width",widthA-50);
                $('#rf_bar').css("width",widthB-50);
                $('#pse_bar').css("width",widthC-50);
                $('#svc_bar').css("width",widthD-50);
            }else{
                $('#ph_bar').css("width",widthA);
                $('#rf_bar').css("width",widthB);
                $('#pse_bar').css("width",widthC);
                $('#svc_bar').css("width",widthD);
            }

            var bar_path = "M16.6,9.2c-3.3,3.1-5.7,6.5-7.3,10c5.7-4.3,12.3-8.3,19.5-11.8c-2.4,4-4.8,8-7.3,12c5.4-5,12.4-8.8,20.9-11.7    c-3.1,4.2-5.8,8-8.9,12.2c6.5-4.4,13.9-8.2,22-11.5c-2.3,3.5-4.5,7-6.8,10.5C54.8,15.2,60.9,11.6,67,8c-2,3.5-4,7-6,10.4    c5.5-4.5,12.5-8.2,20.4-11c-2.7,3.6-5.4,7.2-8.1,10.8c6.8-3.1,13.5-6.2,20.2-9.3c-2.7,3.8-5.3,6.8-7.9,10.6    c5-4.4,11.2-7.2,18.3-10.3c-1.9,3.2-3.9,6.3-5.8,9.5c4.5-4.1,8.6-7.5,16.7-11.3c-1.4,2-3.7,9-5.1,11c5.4-3.7,9.4-6.8,18-10.4    c-1.2,2.7-5,8.9-7.3,11.3c5.3-2.4,14.2-7.8,19.5-10.3c-2,3.5-3.9,7-5.9,10.5c3.8-3.7,9.6-7.9,16.1-9.8c-1.4,2.9-3.1,7-4.5,9.9    c5.8-4.1,14.2-8.7,22.1-11.3c-2.7,3.6-6.9,8-9.6,11.5c6-4,14.6-8.8,22.4-11.3c-2.1,2.8-6.6,8-8.7,10.9c5.3-3.3,14.3-7.5,20.4-10.4    c0.4,2-3.4,8.7-6.6,10.6l15.9-10.7c0,0-3.7,7.8-5.9,10.9c0,0,10.2-8.4,17.5-11.9c-2.4,4-4.9,8-7.3,12c5.4-4.9,12.7-9.4,21.3-12.3    c-3.1,4.2-6.1,8.7-9.2,12.9c6.5-4.4,13.9-8.5,22-11.8c-2.3,3.5-4.5,7-6.8,10.5c6.1-3.7,12.2-7.3,18.3-10.9c-2,3.5-4,7-6,10.4    c5.5-4.5,12.5-8.2,20.4-11c-2.7,3.6-5.4,7.2-8.1,10.8c6.8-3.1,13.5-6.2,20.2-9.3c-2.7,3.8-5.3,6.8-7.9,10.6c5-4.4,8-7.5,15-10.6    c-1.9,3.2-0.6,6.6-2.5,9.8c4.5-4.1,6-5.5,14.9-9.8c-1.4,2-1.9,7.6-3.2,9.6c6-4.9,11.1-7.5,16.8-10.3c-1.2,2.7-3.8,8.8-6.1,11.2    c5.3-2.4,14.2-7.8,19.5-10.3c-2,3.5-3.9,7-5.9,10.5c3.8-3.7,9.6-8.3,16.1-10.1c-1.4,2.9-3.1,7.3-4.5,10.2    c5.8-4.1,14.2-8.7,22.1-11.3c-2.7,3.6-6.9,7.7-9.6,11.2c6-4,14.6-8.5,22.4-11c-2.1,2.8-4.7,6.3-6.9,9.1c5.4-3.3,12.6-5.7,18.6-8.6    c0.4,2-5.4,7.7-7.4,9.3l18.2-8.2c-3.3,3.1-5.7,6.5-7.3,10c5.7-4.3,12.3-8.3,19.5-11.8c-2.4,4-4.8,8-7.3,12c5.4-5,12.4-9.8,20.9-12.7    c-3.1,4.2-5.8,8-8.9,12.2c6.5-4.4,13.9-8.2,22-11.5c-2.3,3.5-4.5,7-6.8,10.5c6.1-3.7,12.2-7.3,18.3-10.9c-2,3.5-4,7-6,10.4    c5.5-4.5,12.5-8.2,20.4-11c-2.7,3.6-5.4,7.2-8.1,10.8c6.8-3.1,13.5-6.2,20.2-9.3c-2.7,3.8-5.3,6.8-7.9,10.6    c5-4.4,11.2-7.2,18.3-10.3c-1.9,3.2-3.9,6.3-5.8,9.5c4.5-4.1,8.6-7.5,16.7-11.3c-1.4,2-3.7,9-5.1,11c5.4-3.7,9.4-6.8,18-10.4    c-1.2,2.7-5,8.9-7.3,11.3c5.3-2.4,14.2-7.8,19.5-10.3c-2,3.5-3.9,7-5.9,10.5c3.8-3.7,9.6-7.9,16.1-9.8c-1.4,2.9-3.1,7-4.5,9.9    c5.8-4.1,14.2-8.7,22.1-11.3c-2.7,3.6-6.9,8-9.6,11.5c6-4,14.6-8.8,22.4-11.3c-2.1,2.8-6.6,8-8.7,10.9c5.3-3.3,14.3-7.5,20.4-10.4    c0.4,2-3.4,8.7-6.6,10.6l15.9-10.7c0,0-3.7,7.8-5.9,10.9c0,0,10.2-8.4,17.5-11.9c-2.4,4-4.9,8-7.3,12c5.4-4.9,12.7-9.4,21.3-12.3    c-3.1,4.2-6.1,8.7-9.2,12.9c6.5-4.4,13.9-8.5,22-11.8c-2.3,3.5-4.5,7-6.8,10.5c6.1-3.7,12.2-7.3,18.3-10.9c-2,3.5-4,7-6,10.4    c5.5-4.5,12.5-8.2,20.4-11c-2.7,3.6-5.4,7.2-8.1,10.8c6.8-3.1,13.5-6.2,20.2-9.3c-2.7,3.8-5.3,6.8-7.9,10.6c5-4.4,8-7.5,15-10.6    c-1.9,3.2-0.6,6.6-2.5,9.8c4.5-4.1,6-6.5,14.9-10.8c-1.4,2-1.9,8.6-3.2,10.6c6-4.9,11.1-8.5,16.8-11.3c-1.2,2.7-3.8,8.8-6.1,11.2    c5.3-2.4,14.2-7.8,19.5-10.3c-2,3.5-3.9,7-5.9,10.5c3.8-3.7,9.6-8.3,16.1-10.1c-1.4,2.9-3.1,7.3-4.5,10.2    c5.8-4.1,14.2-8.7,22.1-11.3c-2.7,3.6-6.9,7.7-9.6,11.2c6-4,14.6-8.5,22.4-11c-2.1,2.8-4.7,6.3-6.9,9.1c5.4-3.3,12.6-5.7,18.6-8.6    c0.4,2-5.4,7.7-7.4,9.3";
            
            var ph_bar = {
                "ph_bar": {
                    "strokepath": [
                        {
                            "path": bar_path,
                            'strokeColor': '#96c36c',
                            'strokeWidth': 9,
                            "duration": 3000,
                        },         
                    ],
                    "dimensions": {
                        "width": $('#ph_bar').width(),
                        "height": 30
                    }
                }
            };
            var rf_bar = {
                "rf_bar": {
                    "strokepath": [
                        {
                            "path": bar_path,
                            'strokeColor': '#96c36c',
                            'strokeWidth': 9,                        
                            "duration": 3000,
                        },         
                    ],
                    "dimensions": {
                        "width":  $('#rf_bar').width(),
                        "height": 30
                    }
                }
            };
            var pse_bar = {
                    "pse_bar": {
                        "strokepath": [
                            {
                            "path": bar_path,
                                'strokeColor': '#96c36c',
                                'strokeWidth': 9,
                                "duration": 3000,
                            },         
                        ],
                        "dimensions": {
                            "width":  $('#pse_bar').width(),
                            "height": 30
                        }
                    }
                };
            var svc_bar = {
                "svc_bar": {
                    "strokepath": [
                        {
                            "path": bar_path,
                            'strokeColor': '#96c36c',
                            'strokeWidth': 9,
                            "duration": 3000,
                        },         
                    ],
                    "dimensions": {
                    "width":  $('#svc_bar').width(),
                    "height": 30
                    }
                }
            };

            var $ph_bar = $('#ph_bar');
            $ph_bar.lazylinepainter({
                'svgData': ph_bar,
                'strokeWidth': 9,
                'strokeOpacity':0.5,
                'strokeColor': '#96c36c',
                'drawSequential': false,
                'delay':1000,
                'ease': 'easeInExpo'
            });
            $ph_bar.lazylinepainter('paint');
            

            var $rf_bar = $('#rf_bar');
            $rf_bar.lazylinepainter({
                'svgData': rf_bar,
                'strokeWidth': 9,
                'strokeOpacity':0.5,
                'strokeColor': '#96c36c',
                'drawSequential': false,
                'delay':1000,
                'ease': 'easeInExpo'
            });
            $rf_bar.lazylinepainter('paint');

            
            var $pse_bar = $('#pse_bar');
            $pse_bar.lazylinepainter({
                'svgData': pse_bar,
                'strokeWidth': 9,
                'strokeOpacity':0.5,
                'strokeColor': '#96c36c',
                'drawSequential': false,
                'delay':1000,
                'ease': 'easeInExpo'
            });
            $pse_bar.lazylinepainter('paint');


            var $svc_bar = $('#svc_bar');
            $svc_bar.lazylinepainter({
                'svgData': svc_bar,
                'strokeWidth': 9,
                'strokeOpacity':0.5,
                'strokeColor': '#96c36c',
                'drawSequential': false,
                'delay':1000,
                'ease': 'easeInExpo'
            });
            $svc_bar.lazylinepainter('paint');

            superContainer.find('.resultsview-qhover').hide();
            return false;
        });
};
$(".answers").find('li.selected').parents('.answers').children('svg').addClass('js-animate');
})(jQuery);

$(document).ready(function(){
    
})

