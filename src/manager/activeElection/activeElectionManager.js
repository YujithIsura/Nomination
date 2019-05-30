import { ActiveElection,CallElection }  from 'Models';
var joinjs = require('join-js').default;
// join-js usage : https://www.npmjs.com/package/join-js

const resultMaps = [
  {
    mapId: 'activeElectionMap',
    idProperty: 'id',
    properties: ['id', 'name', 'module_id']
  },
  {
		mapId: 'electionMap',
		idProperty: 'module_id',
		properties: ['name','status','created_by','created_at','updated_at'],
		collections: [
      { name: 'timeLine', mapId: 'timeLineMap', columnPrefix: 'election_' },
      { name: 'division', mapId: 'divisionMap', columnPrefix: 'election_' }
		]
  },
  {
		mapId: 'timeLineMap',
		idProperty: 'electionId',
		properties: ['nominationStart','nominationEnd','objectionStart','objectionEnd']
  },
  {
		mapId: 'divisionMap',
		idProperty: ['team_id','division_id'],
		properties: ['team_id','division_id']
	},
];


const mapToActiveElectionModel = (activeElections) => {
  const mappedActiveElections = joinjs.map(activeElections, resultMaps, 'activeElectionMap', 'activeElection_');

  //just an example how to convert row data object to Model
  return ActiveElection({
    id: mappedActiveElections[0].id,
    name: mappedActiveElections[0].name,
    module_id: mappedActiveElections[0].module_id,
  });
};


const mapToElectionModel = (activeElections) => {
  console.log("var activeElections = ",activeElections);
  const mappedElections = joinjs.map(activeElections, resultMaps, 'electionMap', 'election_');

  console.log("var mappedElections = ",mappedElections);
// console.log("mappedElections",mappedElections);
  return CallElection({
    name: mappedElections[0].name,
    module_id: mappedElections[0].module_id,
    status: mappedElections[0].status,
    created_by: mappedElections[0].created_by,
    created_at: mappedElections[0].created_at,
    updated_at: mappedElections[0].updated_at,

    // TODO handle the timeline array empty case.
    timeLineData: mappedElections[0].timeLine[0],

    rowData: mappedElections[0].division,
  });
};


export default {
  mapToActiveElectionModel,
  mapToElectionModel
};
