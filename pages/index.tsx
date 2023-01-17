import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import dynamic from 'next/dynamic';

const FastboardComponent = dynamic(
  () =>
    import('../component/Fastboard').then((mod) => {
      return mod.FastboardComponent;
    }),
  {
    loading: () => <>Loading&nbsp;&hellip;</>,
    ssr: false,
  }
);

function getRoomToken() {
  return fetch(`/api/token`, {
    method: 'GET',
  }).then((response) => response.json());
}

async function handleClick() {
  const { token, uuid } = await getRoomToken();
}

export default function Home() {
  const SDK_TOKEN = process.env.NEXT_PUBLIC_AGORA_SDK;
  const REGION = 'in-mum';

  const createRoomOption = {
    method: 'POST',
    headers: {
      token: SDK_TOKEN,
      'Content-Type': 'application/json',
      region: REGION,
    },
    body: JSON.stringify({
      isRecord: false,
    }),
  };

  function getTokenOption(role: string) {
    return {
      method: 'POST',
      headers: {
        token: SDK_TOKEN,
        'Content-Type': 'application/json',
        region: REGION,
      },
      body: JSON.stringify({ lifespan: 3600000, role: role }),
    };
  }

  const [userId] = React.useState(parseInt(`${Math.random() * 1e6}`) + '');
  const [uuid, setRoomId] = React.useState<string | undefined>(undefined);
  const [roomToken, setRoomToken] = React.useState<string | undefined>(
    undefined
  );
  const [showButton, setShowButton] = React.useState<boolean>(true);
  const [txtValue, setTxt] = React.useState<string>('');
  const [isWrite, setWrite] = React.useState(true);

  async function createRoom() {
    try {
      const res = await fetch(
        `https://api.netless.link/v5/rooms`,
        createRoomOption
      );
      const data = await res.json();
      console.log('response of the room create', data);
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async function createToken(uuid: string, role: string) {
    try {
      const op = getTokenOption(role);
      const res = await fetch(
        `https://api.netless.link/v5/tokens/rooms/${uuid}`,
        op
      );
      const data = await res.json();
      console.log('response of the token', data);
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    console.log('----------- Start token generation -----------');
    /*  createRoom()
      .then((response) => {
        console.log('@@@@ response create room >', response);
        setRoomId(response.uuid);
        return createToken(response.uuid);
      })
      .then((res) => {
        console.log('@@@@ token >>>', res);
        setRoomToken(res);
      }); */
  }, []);

  function generateToken(role: string) {
    console.log('generate token with role', role);
    if (role === 'reader') {
      setWrite(false);
    }
    createToken(uuid ?? '', role).then((res) => {
      console.log('@@@@ Token individual >>>', res);
      setRoomToken(res);
      setShowButton(false);
    });
  }

  function getRoomToken() {
    if (txtValue === '') {
      console.log('new room');
      createRoom().then((response) => {
        console.log('@@@@ Response create room uuid >>>', response);
        setRoomId(response.uuid);
        console.log('@@@ New room id ----->', txtValue);
      });
    } else {
      setRoomId(txtValue);
      console.log('@@@@ Set room token ----->', txtValue);
    }
  }
  const Fastboard = dynamic(
    () => import('@netless/fastboard-react').then((mod) => mod.Fastboard),
    {
      loading: () => <>Loading&nbsp;&hellip;</>,
      ssr: false,
    }
  );

  if (
    typeof uuid === 'undefined' ||
    typeof roomToken === 'undefined' ||
    typeof window === 'undefined' ||
    showButton
  ) {
    return (
      <header className="App-header">
        <button onClick={getRoomToken}>Generate/Set Room UUID</button>
        <input
          value={txtValue}
          onChange={(evt) => setTxt(evt?.target?.value ?? '')}
        />
        <button onClick={() => generateToken('reader')}>
          Generate Read Token
        </button>
        <button onClick={() => generateToken('writer')}>
          Generate Writer Token
        </button>
        <button onClick={() => generateToken('admin')}>
          Generate Admin Token
        </button>
      </header>
    );
  }

  return (
    <>
      <Head>
        <title>Agora Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
          <FastboardComponent
            uuid={uuid}
            userId={userId}
            roomToken={roomToken}
            isWritable={isWrite}
          />
       
    </>
  );
}
