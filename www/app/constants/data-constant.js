(function() {

  /*
   * Stores application data.
   */
  angular.module('seventeendays').constant('DATA', {
    // NOTE: Data model here is still not optimal, but this
    // provides for a cleaner service layer when working with data.
    // At this juncture, we prefer to explicitly list
    // step properties rather than computing them with a
    // heuristic (e.g., eva(cog1).html => { marker: (Cog1) }).
    steps: {
      'opencog1.html': { thisaction: 'timestamp', marker: 'Cog0' },
      'open2.html': { marker: 'CogCondom1' },
      'open3.html': { marker: 'CogCondom2' },
      'evacog1.html': { marker: 'EvaCog1' },
      'evacog2.html': { marker: 'EvaCog2' },
      'evacog3.html': { marker: 'EvaCog3' },
      'evacog4.html': { marker: 'EvaCog4' },
      'evacog5.html': { marker: 'EvaCog5' },
      'haileycog1.html': { marker: 'HaileyCog1' },
      'haileycog2.html': { marker: 'HaileyCog2' },
      'haileycog3.html': { marker: 'HaileyCog3' },
      'haileycog4.html': { marker: 'HaileyCog4' },
      'haileycog5.html': { marker: 'HaileyCog5' },
      'isabelcog1.html': { marker: 'IsabelCog1' },
      'isabelcog2.html': { marker: 'IsabelCog2' },
      'isabelcog3.html': { marker: 'IsabelCog3' },
      'isabelcog4.html': { marker: 'IsabelCog4' },
      'isabelcog5.html': { marker: 'IsabelCog5' },
      'laurencog1.html': { marker: 'LaurenCog1' },
      'laurencog2.html': { marker: 'LaurenCog2' },
      'laurencog3.html': { marker: 'LaurenCog3' },
      'laurencog4.html': { marker: 'LaurenCog4' },
      'laurencog5.html': { marker: 'LaurenCog5' },
      'mayacog1.html': { marker: 'MayaCog1' },
      'mayacog2.html': { marker: 'MayaCog2' },
      'mayacog3.html': { marker: 'MayaCog3' },
      'mayacog4.html': { marker: 'MayaCog4' },
      'mayacog5.html': { marker: 'MayaCog5' },
      'nickicog1.html': { marker: 'NickiCog1' },
      'nickicog2.html': { marker: 'NickiCog2' },
      'nickicog3.html': { marker: 'NickiCog3' },
      'nickicog4.html': { marker: 'NickiCog4' },
      'nickicog5.html': { marker: 'NickiCog5' }
    },
    paths: {
      open: {
        "opening": {"label":"Opening sequence","redirect":"bonfire","redirectView":true,"steps":["open1.mp4","opencog1.html","open2.mp4","open2.html","open3.mp4","open3.html","open4noquit.mp4"]}
      },
      openpreview: {
        "opening": {"label":"Preview","steps":["open1.mp4"]}
      },
      close: {
        "opening": {"label":"Closing sequence","redirect":"jessica","redirectView":true,"steps":["wrapup1.mp4","wrapup2.mp4","lastscene.mp4","jessicasroom.mp4"]}
      },
      eva: {
        "opening": {"action":"timestamp","marker":"EvaOpen","steps":["evaopen.mp4","evachoice1.html"]},
        "evachoice1a": {"label":"Pretty convincing","action":"increment","marker":"EvaChoice1a","steps":["evachoice1a.mp4","evachoice2.html"]},
        "evachoice1b": {"label":"You dont know me","action":"increment","marker":"EvaChoice1b","redirect":"evachoice1a","steps":["evachoice1c.mp4","evacog1.html","evaend1bc.mp4"]},
        "evachoice1c": {"label":"Not here for that","action":"increment","marker":"EvaChoice1c","redirect":"evachoice1a","steps":["evachoice1b.mp4","evacog1.html","evaend1bc.mp4"]},
        "evachoice2a": {"label":"Lets go","action":"increment","marker":"EvaChoice2a","steps":["evachoice2a.mp4","evachoice3.html"]},
        "evachoice2b": {"label":"I want to stay here","action":"increment","marker":"EvaChoice2b","redirect":"evachoice2a","steps":["evachoice2b.mp4","evacog2.html","evaend2bc.mp4"]},
        "evachoice2c": {"label":"I have to help Lauren","action":"increment","marker":"EvaChoice2c","redirect":"evachoice2a","steps":["evachoice2c.mp4","evacog2.html","evaend2bc.mp4"]},
        "evachoice3a": {"label":"Wow nice","action":"increment","marker":"EvaChoice3a","steps":["evachoice3a.mp4","evachoice4.html"]},
        "evachoice3b": {"label":"Keep my clothes on","action":"increment","marker":"EvaChoice3b","redirect":"evachoice3a","steps":["evachoice3b.mp4","evacog3.html","evaend3bc.mp4"]},
        "evachoice3c": {"label":"Dont know you","action":"increment","marker":"EvaChoice3c","redirect":"evachoice3a","steps":["evachoice3c.mp4","evacog3.html","evaend3bc.mp4"]},
        "evachoice4a": {"label":"Do you have a condom","action":"increment","marker":"EvaChoice4a","steps":["evachoice4a.mp4","evachoice4b.mp4","evacog4-1.html","eva4b-2.mp4","evacog4-2.html","evaend4bc.mp4"]},
        "evachoice4b": {"label":"I have one","action":"increment","marker":"EvaChoice4b","steps":["evachoice4b.mp4","evacog4-1.html","eva4b-2.mp4","evacog4-2.html","evaend4bc.mp4"]},
        "evachoice4c": {"label":"In my pocket","action":"increment","marker":"EvaChoice4c","steps":["evachoice4c.mp4","evacog4-1.html","eva4c-2.mp4","evacog4-2.html","evaend4bc.mp4"]}
      },
      hailey: {
        "opening": {"action":"timestamp","marker":"HaileyOpen","steps":["haileyopen.mp4","haileychoice1.html"]},
        "haileychoice1a": {"label":"Mmm","action":"increment","marker":"HaileyChoice1a","steps":["haileychoice1a.mp4","haileychoice2.html"]},
        "haileychoice1b": {"label":"Turn into a frog","action":"increment","marker":"HaileyChoice1b","redirect":"haileychoice1a","steps":["haileychoice1b.mp4","haileycog1.html","haileyend1bc.mp4"]},
        "haileychoice1c": {"label":"Second kiss on my terms","action":"increment","marker":"HaileyChoice1c","redirect":"haileychoice1a","steps":["haileychoice1c.mp4","haileycog1.html","haileyend1bc.mp4"]},
        "haileychoice2a": {"label":"Okay","action":"increment","marker":"HaileyChoice2a","steps":["haileychoice2a.mp4","haileychoice3.html"]},
        "haileychoice2b": {"label":"Rather hear your guitar","action":"increment","marker":"HaileyChoice2b","redirect":"haileychoice2a","steps":["haileychoice2b.mp4","haileycog2.html","haileyend2bc.mp4"]},
        "haileychoice2c": {"label":"Im good where we are","action":"increment","marker":"HaileyChoice2c","redirect":"haileychoice2a","steps":["haileychoice2c.mp4","haileycog2.html","haileyend2bc.mp4"]},
        "haileychoice3a": {"label":"Okay","action":"increment","marker":"HaileyChoice3a","steps":["haileychoice3a.mp4","haileychoice4.html"]},
        "haileychoice3b": {"label":"Not tonight","action":"increment","marker":"HaileyChoice3b","redirect":"haileychoice3a","steps":["haileychoice3b.mp4","haileycog3.html","haileyend3bc.mp4"]},
        "haileychoice3c": {"label":"Just make out","action":"increment","marker":"HaileyChoice3c","redirect":"haileychoice3a","steps":["haileychoice3c.mp4","haileycog3.html","haileyend3bc.mp4"]},
        "haileychoice4a": {"label":"Do you have one","action":"increment","marker":"HaileyChoice4a","steps":["haileychoice4a.mp4","haileychoice4b.mp4","haileycog4-1.html","hailey4b-2.mp4","haileycog4-2.html","haileyend4bc.mp4"]},
        "haileychoice4b": {"label":"Im prepared","action":"increment","marker":"HaileyChoice4b","steps":["haileychoice4b.mp4","haileycog4-1.html","hailey4b-2.mp4","haileycog4-2.html","haileyend4bc.mp4"]},
        "haileychoice4c": {"label":"Guess what I have?","action":"increment","marker":"HaileyChoice4c","steps":["haileychoice4c.mp4","haileycog4-1.html","hailey4c-2.mp4","haileycog4-2.html","haileyend4bc.mp4"]}
      },
      isabel: {
        "opening": {"action":"timestamp","marker":"IsabelOpen","steps":["isabelopen.mp4","isabelchoice1.html"]},
        "isabelchoice1a": {"label":"Okay","action":"increment","marker":"IsabelChoice1a","steps":["isabelchoice1a.mp4","isabelchoice2.html"]},
        "isabelchoice1b": {"label":"Told Lauren Id help","action":"increment","marker":"IsabelChoice1b","redirect":"isabelchoice1a","steps":["isabelchoice1b.mp4","isabelcog1.html","isabelend1bc.mp4"]},
        "isabelchoice1c": {"label":"Lets stay here","action":"increment","marker":"IsabelChoice1c","redirect":"isabelchoice1a","steps":["isabelchoice1c.mp4","isabelcog1.html","isabelend1bc.mp4"]},
        "isabelchoice2a": {"label":"Me too","action":"increment","marker":"IsabelChoice2a","steps":["isabelchoice2a.mp4","isabelchoice3.html"]},
        "isabelchoice2b": {"label":"I dont feel like it","action":"increment","marker":"IsabelChoice2b","redirect":"isabelchoice2a","steps":["isabelchoice2b.mp4","isabelcog2.html","isabelend2bc.mp4"]},
        "isabelchoice2c": {"label":"Things will go too far","action":"increment","marker":"IsabelChoice2c","redirect":"isabelchoice2a","steps":["isabelchoice2c.mp4","isabelcog2.html","isabelend2bc.mp4"]},
        "isabelchoice3a": {"label":"I heard that too","action":"increment","marker":"IsabelChoice3a","steps":["isabelchoice3a.mp4","isabelchoice4.html"]},
        "isabelchoice3b": {"label":"Did we make up?","action":"increment","marker":"IsabelChoice3b","redirect":"isabelchoice3a","steps":["isabelchoice3b.mp4","isabelcog3.html","isabelend3bc.mp4"]},
        "isabelchoice3c": {"label":"Keep doing this","action":"increment","marker":"IsabelChoice3c","redirect":"isabelchoice3a","steps":["isabelchoice3c.mp4","isabelcog3.html","isabelend3bc.mp4"]},
        "isabelchoice4a": {"label":"Do you have a condom?","action":"increment","marker":"IsabelChoice4a","steps":["isabelchoice4a.mp4","isabelchoice4b.mp4","isabelcog4-1.html","isabel4b-2.mp4","isabelcog4-2.html","isabelend4bc.mp4"]},
        "isabelchoice4b": {"label":"I have a condom","action":"increment","marker":"IsabelChoice4b","steps":["isabelchoice4b.mp4","isabelcog4-1.html","isabel4b-2.mp4","isabelcog4-2.html","isabelend4bc.mp4"]},
        "isabelchoice4c": {"label":"Got a condom today","action":"increment","marker":"IsabelChoice4c","steps":["isabelchoice4c.mp4","isabelcog4-1.html","isabel4c-2.mp4","isabelcog4-2.html","isabelend4bc.mp4"]}
      },
      lauren: {
        "opening": {"action":"timestamp","marker":"LaurenOpen","steps":["laurenopen.mp4","laurenchoice1.html"]},
        "laurenchoice1a": {"label":"Okay","action":"increment","marker":"LaurenChoice1a","steps":["laurenchoice1a.mp4","laurenchoice2.html"]},
        "laurenchoice1b": {"label":"Go get the food","action":"increment","marker":"LaurenChoice1b","redirect":"laurenchoice1a","steps":["laurenchoice1b.mp4","laurencog1.html","laurenend1bc.mp4"]},
        "laurenchoice1c": {"label":"I should stay here","action":"increment","marker":"LaurenChoice1c","redirect":"laurenchoice1a","steps":["laurenchoice1c.mp4","laurencog1.html","laurenend1bc.mp4"]},
        "laurenchoice2a": {"label":"Okay","action":"increment","marker":"LaurenChoice2a","steps":["laurenchoice2a.mp4","laurenchoice3.html"]},
        "laurenchoice2b": {"label":"Im not ready","action":"increment","marker":"LaurenChoice2b","redirect":"laurenchoice2a","steps":["laurenchoice2b.mp4","laurencog2.html","laurenend2bc.mp4"]},
        "laurenchoice2c": {"label":"We got carried away","action":"increment","marker":"LaurenChoice2c","redirect":"laurenchoice2a","steps":["laurenchoice2c.mp4","laurencog2.html","laurenend2bc.mp4"]},
        "laurenchoice3a": {"label":"Im ready","action":"increment","marker":"LaurenChoice3a","steps":["laurenchoice3a.mp4","laurenchoice4.html"]},
        "laurenchoice3b": {"label":"I dont want to rush into something","action":"increment","marker":"LaurenChoice3b","redirect":"laurenchoice3a","steps":["laurenchoice3b.mp4","laurencog3.html","laurenend3bc.mp4"]},
        "laurenchoice3c": {"label":"Keep doing this","action":"increment","marker":"LaurenChoice3c","redirect":"laurenchoice3a","steps":["laurenchoice3c.mp4","laurencog3.html","laurenend3bc.mp4"]},
        "laurenchoice4a": {"label":"Do you have one?","action":"increment","marker":"LaurenChoice4a","steps":["laurenchoice4a.mp4","laurenchoice4b.mp4","laurencog4-1.html","lauren4b-2.mp4","laurencog4-2.html","laurenend4bc.mp4"]},
        "laurenchoice4b": {"label":"I have one","action":"increment","marker":"LaurenChoice4b","steps":["laurenchoice4b.mp4","laurencog4-1.html","lauren4b-2.mp4","laurencog4-2.html","laurenend4bc.mp4"]},
        "laurenchoice4c": {"label":"Have one just in case","action":"increment","marker":"LaurenChoice4c","steps":["laurenchoice4c.mp4","laurencog4-1.html","lauren4c-2.mp4","laurencog4-2.html","laurenend4bc.mp4"]}
      },
      maya: {
        "opening": {"action":"timestamp","marker":"MayaOpen","steps":["mayaopen.mp4","mayachoice1.html"]},
        "mayachoice1a": {"label":"Okay","action":"increment","marker":"MayaChoice1a","steps":["mayachoice1a.mp4","mayachoice2.html"]},
        "mayachoice1b": {"label":"You can handle it","action":"increment","marker":"MayaChoice1b","redirect":"mayachoice1a","steps":["mayachoice1b.mp4","mayacog1.html","mayaend1bc.mp4"]},
        "mayachoice1c": {"label":"You go ahead","action":"increment","marker":"MayaChoice1c","redirect":"mayachoice1a","steps":["mayachoice1c.mp4","mayacog1.html","mayaend1bc.mp4"]},
        "mayachoice2a": {"label":"That feels nice","action":"increment","marker":"MayaChoice2a","steps":["mayachoice2a.mp4","mayachoice3.html"]},
        "mayachoice2b": {"label":"Thats far enough","action":"increment","marker":"MayaChoice2b","redirect":"mayachoice2a","steps":["mayachoice2b.mp4","mayacog2.html","mayaend2bc.mp4"]},
        "mayachoice2c": {"label":"You need a time out","action":"increment","marker":"MayaChoice2c","redirect":"mayachoice2a","steps":["mayachoice2c.mp4","mayacog2.html","mayaend2bc.mp4"]},
        "mayachoice3a": {"label":"Lets do it","action":"increment","marker":"MayaChoice3a","steps":["mayachoice3a.mp4","mayachoice4.html"]},
        "mayachoice3b": {"label":"I like what were doing","action":"increment","marker":"MayaChoice3b","redirect":"mayachoice3a","steps":["mayachoice3b.mp4","mayacog3.html","mayaend3bc.mp4"]},
        "mayachoice3c": {"label":"This isnt the right time","action":"increment","marker":"MayaChoice3c","redirect":"mayachoice3a","steps":["mayachoice3c.mp4","mayacog3.html","mayaend3bc.mp4"]},
        "mayachoice4a": {"label":"Do you have a condom?","action":"increment","marker":"MayaChoice4a","steps":["mayachoice4a.mp4","mayachoice4b.mp4","mayacog4-1.html","maya4b-2.mp4","mayacog4-2.html","mayaend4bc.mp4"]},
        "mayachoice4b": {"label":"I have one","action":"increment","marker":"MayaChoice4b","steps":["mayachoice4b.mp4","mayacog4-1.html","maya4b-2.mp4","mayacog4-2.html","mayaend4bc.mp4"]},
        "mayachoice4c": {"label":"Condom in my purse","action":"increment","marker":"MayaChoice4c","steps":["mayachoice4c.mp4","mayacog4-1.html","maya4c-2.mp4","mayacog4-2.html","mayaend4bc.mp4"]}
      },
      nicki: {
        "opening": {"action":"timestamp","marker":"NickiOpen","steps":["nickiopen.mp4","nickichoice1.html"]},
        "nickichoice1a": {"label":"Okay","action":"increment","marker":"NickiChoice1a","steps":["nickichoice1a.mp4","nickichoice2.html"]},
        "nickichoice1b": {"label":"We hardly hang out","action":"increment","marker":"NickiChoice1b","redirect":"nickichoice1a","steps":["nickichoice1b.mp4","nickicog1.html","nickiend1bc.mp4"]},
        "nickichoice1c": {"label":"Whats my name?","action":"increment","marker":"NickiChoice1c","redirect":"nickichoice1a","steps":["nickichoice1c.mp4","nickicog1.html","nickiend1bc.mp4"]},
        "nickichoice2a": {"label":"Lets go","action":"increment","marker":"NickiChoice2a","steps":["nickichoice2a.mp4","nickichoice3.html"]},
        "nickichoice2b": {"label":"Not so fast","action":"increment","marker":"NickiChoice2b","redirect":"nickichoice2a","steps":["nickichoice2b.mp4","nickicog2.html","nickiend2bc.mp4"]},
        "nickichoice2c": {"label":"I told Lauren","action":"increment","marker":"NickiChoice2c","redirect":"nickichoice2a","steps":["nickichoice2c.mp4","nickicog2.html","nickiend2bc.mp4"]},
        "nickichoice3a": {"label":"I want you too","action":"increment","marker":"NickiChoice3a","steps":["nickichoice3a.mp4","nickichoice4.html"]},
        "nickichoice3b": {"label":"Im not ready","action":"increment","marker":"NickiChoice3b","redirect":"nickichoice3a","steps":["nickichoice3b.mp4","nickicog3.html","nickiend3bc.mp4"]},
        "nickichoice3c": {"label":"Moving too fast","action":"increment","marker":"NickiChoice3c","redirect":"nickichoice3a","steps":["nickichoice3c.mp4","nickicog3.html","nickiend3bc.mp4"]},
        "nickichoice4a": {"label":"Do you have a condom?","action":"increment","marker":"NickiChoice4a","steps":["nickichoice4a.mp4","nickichoice4b.mp4","nickicog4-1.html","nicki4b-2.mp4","nickicog4-2.html","nickiend4bc.mp4"]},
        "nickichoice4b": {"label":"I have a condom","action":"increment","marker":"NickiChoice4b","steps":["nickichoice4b.mp4","nickicog4-1.html","nicki4b-2.mp4","nickicog4-2.html","nickiend4bc.mp4"]},
        "nickichoice4c": {"label":"Condom carrier","action":"increment","marker":"NickiChoice4c","steps":["nickichoice4c.mp4","nickicog4-1.html","nicki4c-2.mp4","nickicog4-2.html","nickiend4bc.mp4"]}
      },
      bonfire: {
        "eva": {"steps":["app.eva"]},
        "hailey": {"steps":["app.hailey"]},
        "isabel": {"steps":["app.isabel"]},
        "lauren": {"steps":["app.lauren"]},
        "maya": {"steps":["app.maya"]},
        "nicki": {"steps":["app.nicki"]}
      },
      jessica: {
        "opening": {"label":"Jessica Menu","steps":["jessicamenu.html"]},
        "jessicachoice1a": {"label":"Going to the gynecologist","action":"timestamp","marker":"Gyno","redirect":"opening","steps":["gyneexam.mp4","gynecog1.mp4","gynecog1.html","gynecog2.mp4","gynecog2.html"]},
        "jessicachoice1b": {"label":"I got birth control and so can you","redirect":"birthcontrol","redirectView":true,"steps":["bcintro.mp4","bccog1.mp4","bccog1.html","bccog2.mp4","bccog2.html","bccog3.mp4","bccog3.html"]},
        "jessicachoice1c": {"label":"Know your body","redirect":"kyb","redirectView":true,"steps":["kyb.mp4"]},
        "jessicachoice1d": {"label":"Watch out for STis","action":"timestamp","marker":"STI","redirect":"stimain","redirectView":true,"steps":["riskometer.mp4"]},
        "jessicachoice1e": {"label":"Haileys condom dos and donts","action":"timestamp","marker":"CondomDosAndDonts","redirect":"opening","steps":["open2-jessicasroom.mp4","opencog2.html","open3.mp4","opencog3.html","open4-jessicasroom.mp4"]},
        "jessicachoice1f": {"label":"Jessica and her friends","redirect":"bonfire","redirectView":true,"steps":["open4quit-jessicasroom.mp4"]}
      },
      birthcontrol: {
        "opening": {"action":"timestamp","marker":"BCOpen","steps":["bcmain.html"]},
        "bc1a": {"action":"increment","marker":"BCdetailEC","redirect":"opening","steps":["ec.mp4"]},
        "bc1b": {"action":"increment","marker":"BCdetailPill","redirect":"opening","steps":["thepill.mp4"]},
        "bc1c": {"action":"increment","marker":"BCdetailDepo","redirect":"opening","steps":["depo.mp4"]},
        "bc1d": {"action":"increment","marker":"BCdetailNuva","redirect":"opening","steps":["nuva.mp4"]},
        "bc1e": {"action":"increment","marker":"BCdetailPatch","redirect":"opening","steps":["patch.mp4"]},
        "bc1f": {"action":"increment","marker":"BCdetailCondoms","redirect":"opening","steps":["condoms.mp4"]},
        "bc1g": {"action":"increment","marker":"BCdetailImplant","redirect":"opening","steps":["implant.mp4"]},
        "bc1h": {"action":"increment","marker":"BCdetailIUD","redirect":"opening","steps":["iud.mp4"]},
        "bc1i": {"action":"increment","marker":"BCdetailOther","redirect":"opening","steps":["othermethods.mp4"]}
      },
      stimain: {
        "opening": {"steps":["sti-main.html"]},
        "stimn1a": {"action":"increment","marker":"STIdetailWhat","redirect":"opening","steps":["whatcausesstis.mp4"]},
        "stimn2a": {"action":"increment","marker":"STIdetailKnow","redirect":"opening","steps":["howdoyouknow.mp4"]},
        "stimn3a": {"action":"increment","marker":"STIdetailGet","redirect":"opening","steps":["howdoyouget.mp4"]},
        "stimn4a": {"action":"increment","marker":"STIdetailHave","redirect":"opening","steps":["whatifyouhave.mp4"]},
        "stimn5a": {"action":"increment","marker":"STIdetailSymptoms","redirect":"opening","steps":["whataresymptoms.mp4"]},
        "stimn6a": {"action":"increment","marker":"STIdetailMain","redirect":"opening","steps":["mainstis.mp4"]},
        "stimn7a": {"action":"increment","marker":"STIdetailPlushies","redirect":"stiwhat","redirectView":true,"steps":["plushies.mp4"]}
      },
      kyb: {
        "opening": {"action":"timestamp","marker":"KYBOpen","steps":["kyb.html"]},
        "kyb1": {"action":"increment","marker":"KYBdetailOuterLabia","redirect":"opening","steps":["labia.mp4"]},
        "kyb2": {"action":"increment","marker":"KYBdetailUrethra","redirect":"opening","steps":["urethra.mp4"]},
        "kyb3": {"action":"increment","marker":"KYBdetailVulva","redirect":"opening","steps":["vulva.mp4"]},
        "kyb4": {"action":"increment","marker":"KYBdetailClitoris","redirect":"opening","steps":["clitoris.mp4"]},
        "kyb5": {"action":"increment","marker":"KYBdetailInnerLabia","redirect":"opening","steps":["labia.mp4"]},
        "kyb6": {"action":"increment","marker":"KYBdetailFallopian","redirect":"opening","steps":["fallopian_tubes.mp4"]},
        "kyb7": {"action":"increment","marker":"KYBdetailOvaries","redirect":"opening","steps":["ovaries.mp4"]},
        "kyb8": {"action":"increment","marker":"KYBdetailUterus","redirect":"opening","steps":["uterus.mp4"]},
        "kyb9": {"action":"increment","marker":"KYBdetailCervix","redirect":"opening","steps":["cervix.mp4"]},
        "kyb10": {"action":"increment","marker":"KYBdetailVagina","redirect":"opening","steps":["vagina.mp4"]}
      },
      stiwhat: {
        "opening": {"steps":["stis.html"]},
        "stiWhat1a": {"action":"increment","marker":"STIdetailHerpes","redirect":"opening","steps":["herpes.mp4"]},
        "stiWhat2a": {"action":"increment","marker":"STIdetailGonorrhea","redirect":"opening","steps":["gonorrhea.mp4"]},
        "stiWhat3a": {"action":"increment","marker":"STIdetailChlamydia","redirect":"opening","steps":["chlamydia.mp4"]},
        "stiWhat4a": {"action":"increment","marker":"STIdetailTrich","redirect":"opening","steps":["trich.mp4"]},
        "stiWhat5a": {"action":"increment","marker":"STIdetailHepatitis","redirect":"opening","steps":["hepatitis.mp4"]},
        "stiWhat6a": {"action":"increment","marker":"STIdetailSyphilis","redirect":"opening","steps":["syphilis.mp4"]},
        "stiWhat7a": {"action":"increment","marker":"STIdetailHPV","redirect":"opening","steps":["hpv.mp4"]},
        "stiWhat8a": {"action":"increment","marker":"STIdetailHIV","redirect":"opening","steps":["hiv.mp4"]}
      },
      // Curriculm breakout paths
      // New path attributes:
      // "lessonEnd" - flag for the workflow service to redirect user to lesson code entry page
      // "countdownTime" - numeric value for timer that will send user to lesson code entry page after time value (in seconds) expires
      lesson1: {
        "opening": {"label":"Lesson 1","redirect":"bonfire","action":"timestamp","marker":"Lesson1","redirectView":true,"steps":["YM-1-PR-Intro-V3.mp4"]},
      },
      lesson1close: {
        "opening": {"label":"Lesson 1 close","steps":["YM-1-PR-Outro-V2.mp4"],"lessonEnd":true}
      },
      lesson2: {
        "opening": {"label":"Lesson 2","redirect":"bonfire","action":"timestamp","marker":"Lesson2","redirectView":true,"steps":["YM-2-PR-Intro-V2.mp4"]}
      },
      lesson2close: {
        "opening": {"label":"Lesson 2 close","steps":["YM-2-PR-Outro-V2.mp4"],"lessonEnd":true}
      },
      lesson3: {
        "opening": {"label":"Lesson 3","redirect":"kyb","action":"timestamp","marker":"Lesson3","redirectView":true,"steps":["YM-3-PR.mp4"],"lessonEnd":true,"countdownTime":180}
      },
      lesson4: {
        "opening": {"label":"Lesson 4","action":"timestamp","marker":"Lesson4","steps":["YM-4-PR.mp4"],"lessonEnd":true}
      },
      lesson5: {
        "opening": {"label":"Lesson 5","redirect":"birthcontrol","action":"timestamp","marker":"Lesson5","redirectView":true,"steps":["YM-5-PR-A1.mp4","gynecog1.html","YM-5-PR-A2.mp4","gynecog2.html","YM-5-PR-A3.mp4","YM-5-PR-B-V3.mp4","condoms.mp4","YM-5-PR-C-V2.mp4"],"lessonEnd":true,"countdownTime":180}
      },
      lesson6: {
        "opening": {"label":"Lesson 6","redirect":"stimain","action":"timestamp","marker":"Lesson6","redirectView":true,"steps":["YM-6-PR.mp4"],"lessonEnd":true,"countdownTime":180},
      },
      lesson7: {
        "opening": {"label":"Lesson 7","action":"timestamp","redirect":"bonfire","redirectView":true,"marker":"Lesson7","steps":["YM-7-PR-Intro.mp4"]},
      },
      lesson7close: {
        "opening": {"label":"Lesson 7 close","steps":["YM-7-PR-Outro.mp4"],"lessonEnd":true},
      },
      eslesson1: {
        "opening": {"label":"ES Lesson 1","action":"timestamp","marker":"ESLesson1","steps":["ES-1-PR.mp4"],"lessonEnd":true}
      },
      eslesson2: {
        "opening": {"label":"ES Lesson 2","action":"timestamp","marker":"ESLesson2","steps":["ES-2-PR.mp4"],"lessonEnd":true}
      },
      eslesson3: {
        "opening": {"label":"ES Lesson 3","action":"timestamp","marker":"ESLesson3","steps":["ES-3-PR.mp4"],"lessonEnd":true}
      },
      eslesson4: {
        "opening": {"label":"ES Lesson 4","action":"timestamp","marker":"ESLesson4","steps":["ES-4-PR.mp4"],"lessonEnd":true}
      },
      eslesson5: {
        "opening": {"label":"ES Lesson 5","action":"timestamp","marker":"ESLesson5","steps":["ES-5-PR.mp4"],"lessonEnd":true}
      },
      eslesson6: {
        "opening": {"label":"ES Lesson 6","action":"timestamp","marker":"ESLesson6","steps":["ES-6-PR.mp4"],"lessonEnd":true}
      },
      eslesson7: {
        "opening": {"label":"ES Lesson 7","action":"timestamp","marker":"ESLesson7","steps":["ES-7-PR.mp4"],"lessonEnd":true},
      },
      // Makup lesson data flow
      makeuplesson1: {
        "opening": {"label":"Makeup Lesson 1","redirect":"bonfire","action":"timestamp","marker":"MakeupLesson1","redirectView":true,"steps":["YM-1-1-V2.mp4","YM-1-2-V3.mp4","YM-1-PR-Intro-V3.mp4"]},
      },
      makeuplesson1close: {
        "opening": {"label":"Makeup Lesson 1 close","steps":["YM-1-PR-Outro-V2.mp4"],"lessonEnd":true}
      },
      // Short version of bonfire intro followed by full single girl story
      makeuplesson2: {
        "opening": {"label":"Makup Lesson 2","redirect":"bonfire","action":"timestamp","marker":"MakeupLesson2","redirectView":true,"steps":["YM-2-3-V3.mp4","YM-2-PR-Intro-V2.mp4"]}
      },
      makeuplesson2close: {
        "opening": {"label":"Makup Lesson 2 close","steps":["YM-2-PR-Outro-V2.mp4"],"lessonEnd":true}
      },
      // Know your body mini documentary
      makeuplesson3: {
        "opening": {"label":"Makup Lesson 3","redirect":"kyb","action":"timestamp","marker":"MakeupLesson3","redirectView":true,"steps":["YM-3-3a-V2.mp4","YM-3-3b-V2.mp4","YM-3-PR.mp4"],"lessonEnd":true,"countdownTime":180}
      },
      // Condom scene, cognitive rehearsals (Open2, 11:22 - 12:40/end and Open3 all)
      makeuplesson4: {
        "opening": {"label":"Makup Lesson 4","action":"timestamp","marker":"MakeupLesson4","steps":["YM-4-2-V2.mp4","YM-4-PR.mp4"],"lessonEnd":true}
      },
      // gynecologist mini documentary
      makeuplesson5: {
        "opening": {"label":"Makup Lesson 5","redirect":"birthcontrol","action":"timestamp","marker":"MakeupLesson5","redirectView":true,"steps":["YM-5-1-V2.mp4","YM-5-2.mp4","YM-5-PR-A1.mp4","gynecog1.html","YM-5-PR-A2.mp4","gynecog2.html","YM-5-PR-A3.mp4","YM-5-PR-B-V3.mp4","condoms.mp4","YM-5-PR-C-V2.mp4"],"lessonEnd":true,"countdownTime":180}
      },
      // STI's 9:21 - 10:10 then reports menu for perusing
      makeuplesson6: {
        "opening": {"label":"Makup Lesson 6","redirect":"stimain","action":"timestamp","marker":"MakeupLesson6","redirectView":true,"steps":["YM-6-1-V2.mp4","YM-6-2.mp4","YM-6-PR.mp4"],"lessonEnd":true,"countdownTime":180}
      },
      makeuplesson7: {
        "opening": {"label":"Makup Lesson 7","action":"timestamp","redirect":"bonfire","redirectView":true,"marker":"MakeupLesson7","steps":["YM-7-1-V2.mp4","YM-7-PR-Intro.mp4"]}
      },
      makeuplesson7close: {
        "opening": {"label":"Makeup Lesson 7 close","steps":["YM-7-PR-Outro.mp4"],"lessonEnd":true},
      },
      makeupeslesson1: {
        "opening": {"label":"Makup ES Lesson 1","action":"timestamp","marker":"MakeupESLesson1","steps":["ES-1-1.mp4","ES-1-PR.mp4"],"lessonEnd":true}
      },
      makeupeslesson2: {
        "opening": {"label":"Makup ES Lesson 2","action":"timestamp","marker":"MakeupESLesson2","steps":["ES-2-1.mp4","ES-2-PR.mp4"],"lessonEnd":true}
      },
      makeupeslesson3: {
        "opening": {"label":"Makup ES Lesson 3","action":"timestamp","marker":"MakeupESLesson3","steps":["ES-3-1.mp4","ES-3-PR.mp4"],"lessonEnd":true}
      },
      makeupeslesson4: {
        "opening": {"label":"Makup ES Lesson 4","action":"timestamp","marker":"MakeupESLesson4","steps":["ES-4-1.mp4","ES-4-PR.mp4"],"lessonEnd":true}
      },
      makeupeslesson5: {
        "opening": {"label":"Makup ES Lesson 5","action":"timestamp","marker":"MakeupESLesson5","steps":["ES-5-1.mp4","ES-5-PR.mp4"],"lessonEnd":true}
      },
      makeupeslesson6: {
        "opening": {"label":"Makup ES Lesson 6","action":"timestamp","marker":"MakeupESLesson6","steps":["ES-6-1.mp4","ES-6-PR.mp4"],"lessonEnd":true}
      },
      makeupeslesson7: {
        "opening": {"label":"Makup ES Lesson 7","action":"timestamp","marker":"MakeupESLesson7","steps":["ES-7-1.mp4","ES-7-PR.mp4"],"lessonEnd":true}
      },
    }
  });

})();
