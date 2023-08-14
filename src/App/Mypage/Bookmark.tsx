import { Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { GetAPI } from "../../Api/fetchAPI";
import { BoardArticle } from "../../types/Board";

export default function (): JSX.Element {
  switch (0) {
    default:
      return Bookmark();
  }
}

function Bookmark(): JSX.Element {
  const [bookmark, setBookmark] = useState<BoardArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  const extractBoardIds = () => {
    return GetAPI("/bookmark/my-list").then(res => {
      if (res.success === false) {
        console.log(res.errors);
        return;
      } else {
        const boardIds = res.data.map(item => item.boardId);
        return Promise.resolve(boardIds);
      }
    });
  };

  useEffect(() => {
    extractBoardIds().then(async boardIds => {
      const bookmarks: BoardArticle[] = [];
      for (let i = boardIds.length - 1; i >= 0; i--) {
        await GetAPI(`/board/${boardIds[i]}`).then(res => {
          if (res.success === false) {
            console.log(res.errors);
            return;
          } else {
            bookmarks.push(res.data.board);
          }
        });
      }
      setBookmark(bookmarks);
      setIsLoading(false);
    });
  }, []);

  const detailContent = (boards: BoardArticle) => {
    console.log(boards.id);
    navigation.navigate("QnAdetail", { id: boards.id });
  };

  return (
    <>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView scrollEventThrottle={16}>
          {bookmark.map((bookmark, index) => (
            <>
              <Pressable key={bookmark.id} onPress={() => detailContent(bookmark)}>
                <View style={styles.container}>
                  <View style={styles.head}>
                    <Text>
                      {(() => {
                        switch (bookmark.typeId) {
                          case 1:
                            return "자유 게시판";
                          case 2:
                            return "질문 게시판";
                          case 3:
                            return "지식 게시판";
                          case 4:
                            return "취업/진로 게시판";
                          case 5:
                            return "홍보 게시판";
                          case 6:
                            return "취미 게시판";
                          default:
                            return "알 수 없는 게시판 유형";
                        }
                      })()}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  >
                    <View>
                      <Text style={styles.title}>{bookmark.title}</Text>
                    </View>
                  </View>

                  <View style={styles.head}>
                    <Feather name="thumbs-up" size={13} color="tomato" />
                    <Text style={styles.good}>&#9; {bookmark.likeCnt}</Text>
                    <View style={{ flex: 1 }}></View>
                    <FontAwesome name="comment-o" size={13} color="blue" />
                    <Text style={styles.comment}>&#9; {bookmark.commentCnt}</Text>
                    <Text style={{ justifyContent: "flex-end", fontSize: 10 }}></Text>
                    <Text style={styles.time}>{dateToString(bookmark.createdAt)}</Text>
                  </View>
                </View>
              </Pressable>
              <View style={{ borderBottomWidth: 1, borderColor: "#e8eaec", height: 0 }}></View>
            </>
          ))}
        </ScrollView>
      )}
    </>
  );
}

function dateToString(date: string): string {
  const start = new Date(date);
  const end = new Date();

  const diff = end.getTime() - start.getTime();
  const diffDate = new Date(diff);

  const year = diffDate.getFullYear() - 1970;
  const month = diffDate.getMonth();
  const day = diffDate.getDate() - 1;
  const hour = diffDate.getHours();
  const minute = diffDate.getMinutes();
  const second = diffDate.getSeconds();

  if (year > 0) return `${year}년 전`;
  if (month > 0) return `${month}달 전`;
  if (day > 0) return `${day}일 전`;
  if (hour > 0) return `${hour}시간 전`;
  if (minute > 0) return `${minute}분 전`;
  if (second > 0) return `${second}초 전`;
  return "방금 전";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    margintop: 10,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    justifyContent: "flex-start",
    fontWeight: "bold",
  },
  board: {
    fontSize: 10,
    color: "gray",
  },
  content: {
    fontSize: 15,
    marginVertical: 5,
    marginRight: "50%",
  },
  time: {
    alignItems: "flex-end",
  },
  bottom: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  good: {
    flex: 1,
    fontSize: 10,
    justifyContent: "flex-start",
  },
  comment: {
    flex: 9,
    fontSize: 10,
  },
});