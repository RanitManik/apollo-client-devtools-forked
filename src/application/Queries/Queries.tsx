/** @jsx jsx */
import { Fragment, useState } from "react";
import { jsx, css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import { rem } from "polished";
import { gql, useQuery } from "@apollo/client";
import { List } from "@apollo/space-kit/List";
import { ListItem } from "@apollo/space-kit/ListItem";
import { colors } from "@apollo/space-kit/colors";
import { Theme } from "../theme";
import { SidebarLayout } from "../Layouts/SidebarLayout";
import { RunInGraphiQLButton } from "./RunInGraphiQLButton";
import { QueryViewer } from "./QueryViewer";

export const sidebarHeadingStyles = css`
  margin-left: ${rem(12)};
  text-transform: uppercase;
  font-size: ${rem(13)};
  font-weight: normal;
  letter-spacing: ${rem(1)};
  color: rgba(255, 255, 255, .3);
`;

export const h1Styles = css`
  font-family: monospace;
  font-weight: normal;
`;

export const operationNameStyles = css`
  margin: ${rem(3)} 0 0 ${rem(8)};
  font-family: "Source Sans Pro", sans-serif;
  color: ${colors.grey.light};
  text-transform: uppercase;
  font-size: ${rem(13)};
`;

export const listStyles = css`
  font-family: monospace;
  color: ${colors.silver.lighter};

  > div {
    height: ${rem(36)};
    font-size: ${rem(15)};
  }
`;

const GET_WATCHED_QUERIES = gql`
  query GetWatchedQueries {
    watchedQueries @client {
      queries {
        id
        name
      }
    }
  }
`;

const GET_WATCHED_QUERY = gql`
  query GetWatchedQuery($id: ID!) {
    watchedQuery(id: $id) @client {
      id
      name
      queryString
      variables
      cachedData
    }
  }
`;

export const Queries = ({ navigationProps }) => {
  const [selected, setSelected] = useState<number>(0);
  const theme = useTheme<Theme>();
  const { data } = useQuery(GET_WATCHED_QUERIES);
  const { data: watchedQueryData } = useQuery(GET_WATCHED_QUERY, { 
    variables: { id: selected },
    returnPartialData: true,
  });

  return (
    <SidebarLayout 
      navigationProps={navigationProps}
    >
      <SidebarLayout.Header>
        {watchedQueryData?.watchedQuery && (
          <Fragment>
            <h1 css={h1Styles}>{watchedQueryData?.watchedQuery.name}</h1>
            <span css={operationNameStyles}>Query</span>
            <RunInGraphiQLButton 
              operation={watchedQueryData?.watchedQuery.queryString} 
            />
          </Fragment>
        )}
      </SidebarLayout.Header>
      <SidebarLayout.Sidebar>
        <h3 css={sidebarHeadingStyles}>Active Queries ({navigationProps.queriesCount})</h3>
        <List
          css={listStyles}
          selectedColor={theme.sidebarSelected}
          hoverColor={theme.sidebarHover}
        >
          {data?.watchedQueries?.queries.map(({ name, id }) => {
            return (
              <ListItem 
                key={`${name}-${id}`}
                onClick={() => setSelected(id)}
                selected={selected === id}
              >
                {name}
              </ListItem>
            );
          })}
        </List>
      </SidebarLayout.Sidebar>
      <SidebarLayout.Main>
        {watchedQueryData?.watchedQuery && (
          <QueryViewer
            queryString={watchedQueryData?.watchedQuery.queryString}
            variables={watchedQueryData?.watchedQuery.variables}
            cachedData={watchedQueryData?.watchedQuery.cachedData}
          />
        )}
      </SidebarLayout.Main>
    </SidebarLayout>
  );
};

