let all_chapters = [];
let all_subchapters =[];
let chapter_dict = {};
let timer;
let only_dynamic = false;
let case_location_view = {};


function buildRightMenu(){

  d3.csv("./data/case_studies.csv").then(function(case_studies){
    $('#right-menu-body').append("<div id=title></div>")
    $('#title').append("<h3> Mainstreaming Natural Capital into Policy and Finance: International Case Studies </h3>")
    $('#right-menu-body').append("<div id=book-content></div>")


    for(var i=0;i<case_studies.length;i++){
      if (!only_dynamic || case_studies[i]['dynamic']=='TRUE'){
        chapter = case_studies[i]["ch_no"]
        subchapter = case_studies[i]["number"].replace(".","-")
        if (!(all_chapters.includes(chapter))){
          //Division for chapter
          $('#book-content').append("<div id=right-chapter-"+chapter+"></div>")
          //Chapter Title
          $('#right-chapter-'+chapter).append("<h4>Chapter "+chapter+": "+case_studies[i]['ch_title']+"</h4>")
          chapter_dict[chapter] = [];
          all_chapters.push(chapter)
          
        } 
        chapter_dict[chapter].push(subchapter);
        //Subchapter title
        

        $('#right-chapter-'+chapter).append("<h5 id=right-subchapter-"+subchapter+">"+subchapter+": "+case_studies[i]['name']+"</h5>")

        $('#right-subchapter-'+subchapter).after("<p id="+subchapter+"-summary>"+case_studies[i]['summary']+"</p>")
        all_subchapters.push(subchapter)

        //treat specific figures or images of each case
        right_menu_figures(chapter, subchapter);
        case_location_view[subchapter] = case_studies[i]['location_view']

      }
    }
  });
}

function onScroll(){
  var chapter_pos_promise = new Promise(function(resolve, reject) {
    let chapter_scroll_pos = -1;
    for (var i=0;i<all_chapters.length;i++){
      if (($('#right-menu-body').scrollTop())>=($('#right-chapter-'+all_chapters[i]).offset().top - 1.5*$('#right-menu').position().top)){
        chapter_scroll_pos = i;
      }
      else break
    }
    resolve(chapter_scroll_pos);
  });

  var subchapter_pos_promise = new Promise(function(resolve, reject) {
    let subchapter_scroll_pos = -1;
    for (var i=0;i<all_subchapters.length;i++){
      if (($('#right-menu-body').scrollTop())>=($('#right-subchapter-'+all_subchapters[i]).offset().top - $('#right-menu').position().top)){
        subchapter_scroll_pos = i;
      }
      else break
    }
    resolve(subchapter_scroll_pos);
  });

  //find at which chapter right menu is
  chapter_pos_promise.then(function(chapter_scroll_pos){
    chapter = all_chapters[chapter_scroll_pos]
    //set the color on clicked chapter button (and not others)
    for (var i=0;i<all_chapters.length;i++){
      $('#left-chapter-'+all_chapters[i]).css('background-color', 'black')
    }
    if (!(chapter_scroll_pos == -1)) $('#left-chapter-'+chapter).css('background-color', 'hsl(129, 67%, 64%)')
    })

    //starts if scrolling has stopped
    if(timer !== null) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {

      //to display left sub-menu
      chapter_pos_promise.then(function(chapter_scroll_pos){
        $('#left-menu-sub').remove();
        //$('#left-menu-sub').hide('slow', function(){ $('#left-menu-sub').remove();})
        if (chapter_scroll_pos == -1) display_figure('0')
        else{
          chapter = all_chapters[chapter_scroll_pos]
          let width = chapter_dict[chapter].length*3.5 + 2
          $('#left-chapter-'+chapter).after("<div id=left-menu-sub style='top:"+$('#left-chapter-'+chapter).position().top+"px; width:4vh; left:4vh;'></div>")
          for (var i=0;i<chapter_dict[chapter].length;i++){
            $('#left-menu-sub').append("<span id=left-subchapter-"+chapter_dict[chapter][i]+" class='dot-sub' onclick=subchapterClick("+chapter_dict[chapter][i].toString().split('-')[0]+','+chapter_dict[chapter][i].toString().split('-')[1]+");>" +chapter_dict[chapter][i].toString().split('-')[1]+ "</span>");
          }

          //find at which subchapter right menu is
          subchapter_pos_promise.then(function(subchapter_scroll_pos){
            subchapter = all_subchapters[subchapter_scroll_pos]
            for (var i=0;i<chapter_dict[chapter].length;i++){
              $('#left-subchapter-'+chapter_dict[chapter][i]).css('background-color', 'black')
            }
            if (subchapter_scroll_pos == -1) subchapter = '0'
            else{
              $('#left-subchapter-'+subchapter).css('background-color', 'hsl(129, 67%, 64%)')
              display_figure(subchapter)
            }
          });
        }

      });
    }, 100);


}
