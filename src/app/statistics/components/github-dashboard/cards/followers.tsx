import Image from 'next/image'

import { Heart } from '@/shared/wrappers/phosphor-icons'
import { placeholder } from '@/shared/lib/placeholder'

import { Card } from '../../card'
import { ApiErrorMessage } from '../../api-error'

type User = {
  followers: number
}

type Follower = {
  login: string
  avatar_url: string
  html_url: string
}

const AVATAR_COUNT = 119 // 12x14

export async function Followers() {
  const githubUserRequest = await fetch(
    'https://api.github.com/users/mateusfg7'
  )

  if (!githubUserRequest.ok) {
    console.log(githubUserRequest)
    return (
      <Card
        title="Followers"
        content={
          <div className="flex h-full w-full items-center">
            <ApiErrorMessage />
          </div>
        }
      />
    )
  }

  const { followers: followersNumber }: User = await githubUserRequest.json()

  const numberOfPages = Math.ceil(followersNumber / 100)

  let followers: Follower[] = []
  let error = false

  for (let index = 1; index <= numberOfPages; index++) {
    const githubFollowersRequest = await fetch(
      `https://api.github.com/users/mateusfg7/followers?per_page=100&page=${index}`
    )

    if (!githubFollowersRequest.ok) {
      error = true
      console.log(githubFollowersRequest)
      return
    }

    const list: Follower[] = await githubFollowersRequest.json()

    followers = [...followers, ...list]
  }

  if (error) {
    return (
      <Card
        title="Followers"
        content={
          <div className="flex h-full w-full items-center">
            <ApiErrorMessage />
          </div>
        }
      />
    )
  }

  const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const slicedFollowers: Follower[] = shuffle(followers).slice(0, AVATAR_COUNT)

  return (
    <div className="flex h-full w-full flex-col justify-between gap-2 rounded-3xl bg-neutral-200 p-4 leading-none dark:bg-neutral-950 md:p-7">
      <span className="inline-flex items-center gap-2 text-neutral-600">
        <span>Followers</span>
        <Heart weight="duotone" />
      </span>
      <span className="text-xl">
        <div className="grid grid-cols-12 gap-1">
          {slicedFollowers.map(follower => (
            <a href={follower.html_url} key={follower.login} target="_blank">
              <Image
                src={follower.avatar_url}
                title={follower.login}
                alt=""
                width={400}
                height={400}
                placeholder={placeholder(28, 28) as `data:image/${string}`}
                className="w-7 rounded-full border-2 border-neutral-200 transition-all hover:border-neutral-600 dark:border-neutral-950 dark:hover:border-neutral-400"
              />
            </a>
          ))}
          <a
            href="https://github.com/mateusfg7?tab=followers"
            target="_blank"
            className="flex items-center justify-center text-sm leading-none transition-colors hover:underline"
          >
            +{followersNumber - AVATAR_COUNT}
          </a>
        </div>
      </span>
    </div>
  )
}

export const FollowersSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col justify-between gap-2 rounded-3xl bg-neutral-200 p-4 leading-none dark:bg-neutral-950 md:p-7">
      <span className="inline-flex items-center gap-2 text-neutral-600">
        <span>Followers</span>
        <Heart weight="duotone" />
      </span>
      <span className="text-xl">
        <div className="grid grid-cols-12 gap-1">
          {[...Array(AVATAR_COUNT + 1)].map((e, i) => (
            <div
              key={i}
              className="h-5 w-5 animate-pulse rounded-full border-2 border-neutral-200 bg-neutral-400 dark:border-neutral-950 dark:bg-neutral-800 md:h-7 md:w-7"
            />
          ))}
        </div>
      </span>
    </div>
  )
}
