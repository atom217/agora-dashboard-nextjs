import React from 'react';
import {
  createFastboard,
  FastboardApp,
  Fastboard,
} from '@netless/fastboard-react';

const SDK_TOKEN =process.env.NEXT_PUBLIC_AGORA_SDK ?? '';
const REGION = 'in-mum';
const APP_IDENTITY = process.env.NEXT_PUBLIC_APP_IDENTITY ?? '';

type FastBoardComponentProps = {
  uuid: string;
  userId: string;
  roomToken: string;
  isWritable: boolean;
};

type FastboardAppType = typeof FastboardApp;

export function FastboardComponent(props: FastBoardComponentProps) {
  const { uuid, userId, roomToken, isWritable } = props;

  // can be used via hook avoiding this for now
  /*  const fastboard = useFastboard(() => ({
    sdkConfig: {
      appIdentifier: APP_IDENTITY,
      region: REGION,
    },
    joinRoom: {
      uid: userId,
      uuid: roomId,
      roomToken: roomToken,
    },
  })); */

  /*   async function addImage() {
    try {
      const res = await app.insertImage(
        "https://web-cdn.agora.io/website-files/images/interactive-whiteboard-text-tab-1.png"
    );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  } */

  const [app, setApp] = React.useState<FastboardAppType | null>(null);

  React.useEffect(() => {
    // hold the app instance in the closure.
    // you can not rely on the outer "app" because this callback is only called once.
    let appInstance: FastboardAppType;

    createFastboard({
      sdkConfig: {
        appIdentifier: APP_IDENTITY ?? '',
        region: REGION ?? '',
      },
      joinRoom: {
        uid: userId,
        uuid: uuid,
        roomToken: roomToken,
        isWritable:isWritable
      },
    }).then((app: any) => {
      // save the app instance to outer "app", also hold it by itself
      setApp((appInstance = app));
    });
    // terminate the app on component unmount
    return () => {
      if (appInstance) appInstance.destroy();
    };

    // must be called only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showImage() {
    app?.insertImage(
      'https://web-cdn.agora.io/website-files/images/interactive-whiteboard-text-tab-1.png'
    );
  }

  async function uploadThedoc() {
    const uploadDocOption = {
      method: 'POST',
      headers: {
        token: SDK_TOKEN,
        'Content-Type': 'application/json',
        region: REGION,
      },
      body: JSON.stringify({
        resource:
          'https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pptx',
        type: 'dynamic',
        preview: true,
      }),
    };

    // https://api.netless.link/v5/projector/tasks
    // https://api.netless.link/v5/projector/tasks/20d904a6dc7a4b8c821eb1404beff840

    const response1 = {
      uuid: '20d904a6dc7a4b8c821eb1404beff840',
      type: 'dynamic',
      status: 'Waiting',
    };

    const response2 = {
      uuid: '20d904a6dc7a4b8c821eb1404beff840',
      type: 'dynamic',
      status: 'Finished',
      convertedPercentage: 100,
      pageCount: 2,
      previews: {
        '1': 'https://devthree-agora-whiteboard-docs.s3.ap-south-1.amazonaws.com/dynamicConvert/20d904a6dc7a4b8c821eb1404beff840/preview/1.png',
        '2': 'https://devthree-agora-whiteboard-docs.s3.ap-south-1.amazonaws.com/dynamicConvert/20d904a6dc7a4b8c821eb1404beff840/preview/2.png',
      },
      note: 'https://devthree-agora-whiteboard-docs.s3.ap-south-1.amazonaws.com/dynamicConvert/20d904a6dc7a4b8c821eb1404beff840/jsonOutput/note.json',
      prefix:
        'https://devthree-agora-whiteboard-docs.s3.ap-south-1.amazonaws.com/dynamicConvert',
      zip: 'https://devthree-agora-whiteboard-docs.s3.ap-south-1.amazonaws.com/dynamicConvert/20d904a6dc7a4b8c821eb1404beff840/20d904a6dc7a4b8c821eb1404beff840.zip',
    };

    try {
      const res = await fetch(`https://api.netless.link/v5/rooms`);
      const data = await res.json();
      console.log('response of the room create', data);
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  function showDoc() {
    console.log('show doc');
    const response = {
      uuid: '20d904a6dc7a4b8c821eb1404beff840',
      type: 'dynamic',
      status: 'Finished',
      convertedPercentage: 100,
      pageCount: 2,
      previews: {
        '1': 'https://devthree-agora-whiteboard-docs.s3.ap-south-1.amazonaws.com/dynamicConvert/20d904a6dc7a4b8c821eb1404beff840/preview/1.png',
        '2': 'https://devthree-agora-whiteboard-docs.s3.ap-south-1.amazonaws.com/dynamicConvert/20d904a6dc7a4b8c821eb1404beff840/preview/2.png',
      },
      note: 'https://devthree-agora-whiteboard-docs.s3.ap-south-1.amazonaws.com/dynamicConvert/20d904a6dc7a4b8c821eb1404beff840/jsonOutput/note.json',
      prefix:
        'https://devthree-agora-whiteboard-docs.s3.ap-south-1.amazonaws.com/dynamicConvert',
      zip: 'https://devthree-agora-whiteboard-docs.s3.ap-south-1.amazonaws.com/dynamicConvert/20d904a6dc7a4b8c821eb1404beff840/20d904a6dc7a4b8c821eb1404beff840.zip',
    };
     // app?.putScenes("/", [{name: response.uuid}]);
     app?.insertDocs({
      fileType: 'pptx',
      scenePath: `/${response.uuid}`,
      taskId: response.uuid,
      title: 'filename.pptx',
      url: 'https://devthree-agora-whiteboard-docs.s3.ap-south-1.amazonaws.com/dynamicConvert',
    });

    //app?.insertDocs("hubilo",response);
  }

  return (
    <div
      style={{
        height: '400px',
        border: '1px solid',
        background: '#f1f2f3',
      }}
    >
      <Fastboard app={app} />
      <button onClick={showImage}>Click to show image</button>
      <button onClick={showDoc}>Click to show document</button>
    </div>
  );
}
