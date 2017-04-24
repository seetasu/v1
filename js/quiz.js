// 说明引用了谁的？

(function($) {
    $.fn.jquizzy = function(settings) {
        var defaults = {      //一个json对象
            questions: null,
            startImg: 'img/start.gif',
            endText: 'you have finished!',
            shortURL: null,
            sendResultsURL: null,
            pathDef: 'M16.053,91.059c0.435,0,0.739-0.256,0.914-0.768 c3.101-2.85,5.914-6.734,8.655-9.865C41.371,62.438,56.817,44.11,70.826,24.721c3.729-5.16,6.914-10.603,10.475-15.835 c0.389-0.572,0.785-1.131,1.377-1.521',
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
        introFob = '	<div class="intro-container slide-container"><a class="nav-start" href="#">Are you ready?<br/><br/><span><img src="'+config.startImg+'"></span></a></div>	',
            //开始部分：认真答题，开始图片
            exitFob = '<div class="results-container slide-container"><div class="question-number">' + config.endText + '</div><div class="result-keeper"></div></div><div class="notice">Please select your answer！</div><div class="progress-keeper" ><div class="progress"></div></div>',
            //结束部分：results container里面有结束语，测试结果。提示“请选择”以及进度条也是在这一部分。通过hide和fadein来调出。
            contentFob = '',
            //内容部分
            questionsIteratorIndex,
            answersIteratorIndex;

            superContainer.addClass('main-quiz-holder');
        for (questionsIteratorIndex = 0; questionsIteratorIndex < config.questions.length; questionsIteratorIndex++) //从第0题开始，当前题目数小于题目总数时，执行以下代码，之后跳到下一题
        {
            contentFob += '<div class="slide-container"><div class="question">' + '<div class="question-number">' + (questionsIteratorIndex + 1) + '/' + config.questions.length + '</div>' + config.questions[questionsIteratorIndex].question +'</div><div class="answers-wrap"><ul class="answers">';
            //右上角的进度框，把回答依次parse出来。

            for (answersIteratorIndex = 0; answersIteratorIndex < config.questions[questionsIteratorIndex].answers.length; answersIteratorIndex++) 
            {
                contentFob += '<li><p class="answersLi">' + config.questions[questionsIteratorIndex].answers[answersIteratorIndex] + '</p><svg version="1.1" id="layer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 108.9 100" style="enable-background:new 0 0 108.9 36.9;" xml:space="preserve"><path d="M16.053,91.059c0.435,0,0.739-0.256,0.914-0.768 c3.101-2.85,5.914-6.734,8.655-9.865C41.371,62.438,56.817,44.11,70.826,24.721c3.729-5.16,6.914-10.603,10.475-15.835 c0.389-0.572,0.785-1.131,1.377-1.521"></path></svg></li>';
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
            
            answers.push(config.questions[questionsIteratorIndex].correctAnswer);
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

        superContainer.find('.nav-start').click(function() //点击开始标签时
        {
            $(this).parents('.slide-container').fadeOut(50, 
                function() {
                    $(this).next().fadeIn(50);
                    progressKeeper.fadeIn(50);
                });//其父级元素淡出，父级元素的下一个sibling元素淡入，进度条淡入
            return false;
        });

        superContainer.find('.next').click(function() //点击“下一题”时
        {
            if ($(this).parents('.slide-container').find('li.selected').length === 0) 
            {
                notice.fadeIn(300);//如果没有选中，提示淡入
                return false;
            }


            notice.hide();//隐藏提示


            $(this).parents('.slide-container').fadeOut(50,
                function() {
                    $(this).next().fadeIn(50);
                });//本题淡出，下题淡入

            progress.animate({
                width: progress.width() + Math.round(progressWidth / questionLength)
            },
            50);//进度条出现
            return false;
        });

        superContainer.find('.prev').click(function() //点击  上一题
        {
            notice.hide();
            $(this).parents('.slide-container').fadeOut(50,
                function() {
                    $(this).prev().fadeIn(50);
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
                notice.fadeIn(300);
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

                if (config.shortURL === null) {
                    config.shortURL = window.location
                };

            for (var i = 0; i < 4; i++) 
            {
                resultSet += '<div class="result-row">' + '<div class="correct">#'+(i + 1)+'-'+userAnswers[i]+'</div></div>';
            }
            
            scoreSeeta = seetaScore();

            resultSet = '<h2 class="qTitle">' + judgeSkills(scoreSeeta) +'<br/> Your score:' + scoreSeeta + '</h2>' + shareButton + '<div class="jquizzy-clear"></div>' + resultSet + '<div class="jquizzy-clear"></div>';
            
            superContainer.find('.result-keeper').html(resultSet).show(50);
            

            superContainer.find('.resultsview-qhover').hide();
            return false;
        });
};
})(jQuery);

$(document).ready(function(){
    $(".answers").find('li.selected').parents('.answers').children('svg').addClass('js-animate');
})